package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/violinyap/FYP/commons"
	"github.com/violinyap/FYP/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DATABASE INSTANCE
var collection *mongo.Collection
var goalCollection *mongo.Collection
var journalCollection *mongo.Collection
var todoCollection *mongo.Collection

func DefineCollection(db *mongo.Database) {
	collection = db.Collection("users")
	goalCollection = db.Collection("goal")
	journalCollection = db.Collection("journal")
	todoCollection = db.Collection("todo")
}

type AuthUserReq struct {
	code string `json:"code"`
}
type GithubAuthRes struct {
	AccessToken string `json:"access_token"`
	Scope       string `json:"scope"`
	TokenType   string `json:"token_type"`
	Error       string `json:"error"`
	ErrorDesc   string `json:"error_description"`
}

type GithubUser struct {
	ID         string `json:"id"`
	NodeId     string `json:"node_id"`
	Name       string `json:"name"`
	UserName   string `json:"login"`
	Email      string `json:"email"`
	AvatarURL  string `json:"avatar_url"`
	ProfileURL string `json:"html_url"`
	Token      string `json:"access_token"`
	Bio        string `json:"bio"`
}

func AuthUser(c *gin.Context) {

	// Getting info
	client_id := os.Getenv("GITHUB_CLIENT_ID")
	client_secret := os.Getenv("GITHUB_CLIENT_SECRET")
	redirect_uri := os.Getenv("APP_REDIRECT_URI")

	code := c.PostForm("code")

	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"message": "Auth Code is Empty",
		})
		return
	}

	// Making request
	reqObj := commons.RequestObj{
		URL:         "https://github.com/login/oauth/access_token",
		Method:      "GET",
		AccessToken: "",
		Queries: map[string]string{
			"client_id":     client_id,
			"client_secret": client_secret,
			"redirect_uri":  redirect_uri,
			"code":          code,
		},
	}

	resp_body := commons.MakeReq(c, reqObj)

	var data GithubAuthRes
	json.Unmarshal(resp_body, &data)

	// Process result
	if data.Error != "" {
		fmt.Println("error found")
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"message": data.Error,
			"detail":  data.ErrorDesc,
		})
		return
	}
	access_token := data.AccessToken

	userData := GetGithubUserData(c, access_token)

	if userData.NodeId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "github user not found or code expired",
		})
		return
	}

	userMongoData := FindUser(c, userData, access_token)

	c.JSON(http.StatusOK, gin.H{
		"status":       "posted",
		"uid":          userMongoData.UID,
		"access_token": access_token,
		"user":         userData,
		"new":          userMongoData.GID,
	})

	return
}

func GetGithubUserData(c *gin.Context, access_token string) GithubUser {
	// Making request
	reqObj := commons.RequestObj{
		URL:         "https://api.github.com/user",
		Method:      "GET",
		AccessToken: access_token,
	}

	resp_body := commons.MakeReq(c, reqObj)
	var data GithubUser
	json.Unmarshal(resp_body, &data)

	return data
}

// func CreateUser(c *gin.Context, userData GithubUser, access_token string) interface{} {
// 	if userData.UserName == "" {
// 		log.Printf("Error while creating new user, Reason: empty user\n")
// 		return ""
// 	}
// 	newUser := models.User{
// 		ID:         primitive.NewObjectID(),
// 		GID:        userData.NodeId,
// 		Name:       userData.Name,
// 		UserName:   userData.UserName,
// 		Email:      userData.Email,
// 		AvatarURL:  userData.AvatarURL,
// 		ProfileURL: userData.ProfileURL,
// 		Bio:        userData.Bio,
// 		Token:      access_token,
// 		LastLogin:  time.Now(),
// 		CreatedAt:  time.Now(),
// 		UpdatedAt:  time.Now(),
// 	}
// 	result, err := collection.InsertOne(context.TODO(), newUser)
// 	if err != nil {
// 		log.Printf("Error while inserting new user into db, Reason: %v\n", err)
// 		return ""
// 	}
// 	return result.InsertedID
// }

func toDoc(v interface{}) (doc *bson.M, err error) {
	data, err := bson.Marshal(v)
	if err != nil {
		return
	}

	err = bson.Unmarshal(data, &doc)
	return
}

type FindUserReturn struct {
	UID   string
	GID   interface{}
	Error string
}

// Find and update user
func FindUser(c *gin.Context, userData GithubUser, access_token string) FindUserReturn {

	filter := bson.M{"github_id": userData.NodeId}
	userUpdate := models.User{
		GID:        userData.NodeId,
		Name:       userData.Name,
		UserName:   userData.UserName,
		Email:      userData.Email,
		AvatarURL:  userData.AvatarURL,
		ProfileURL: userData.ProfileURL,
		Bio:        userData.Bio,
		Token:      access_token,
		LastLogin:  time.Now(),
		UpdatedAt:  time.Now(),
	}
	doc, err := toDoc(userUpdate)
	if err != nil {
		fmt.Print(err)
	}
	update := bson.M{"$set": doc}
	opts := options.FindOneAndUpdate().SetUpsert(true)
	result := collection.FindOneAndUpdate(context.TODO(), filter, update, opts)

	if result.Err() != nil {
		fmt.Println(result.Err())
		return FindUserReturn{}
	}

	newDoc := bson.M{}
	decodeErr := result.Decode(&newDoc)
	fmt.Println(decodeErr)

	mongoId := newDoc["_id"]
	githubId := newDoc["github_id"]
	stringObjectID := mongoId.(primitive.ObjectID).Hex()

	return FindUserReturn{UID: stringObjectID, GID: githubId}
}

func GetSingleUser(c *gin.Context) {
	userId := c.Param("userId")
	user := User{}
	err := collection.FindOne(context.TODO(), bson.M{"id": userId}).Decode(&user)
	if err != nil {
		log.Printf("Error while getting a single user, Reason: %v\n", err)
		c.JSON(http.StatusNotFound, gin.H{
			"status":  http.StatusNotFound,
			"message": "User not found",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "Single User",
		"data":    user,
	})
	return
}

type WorkTime struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type OnboardUserParams struct {
	UserId       string `form:"userId"`
	CoderType    string `form:"coderType"`
	Birthday     string `form:"bday"`
	MBTI         string `form:"mbti"`
	Workdays     string `form:"wdays"`
	Workstart    string `form:"wstart"`
	Workend      string `form:"wend"`
	Repos        string `form:"repos"`
	Productivity int    `form:"productivity"`
	Stress       int    `form:"stress"`
}

func OnboardUser(c *gin.Context) {
	var params OnboardUserParams
	c.Bind(&params)

	fmt.Println("paraams ==================", params)

	objID, err := primitive.ObjectIDFromHex(params.UserId)
	filter := bson.M{"user_id": objID}
	userUpdate := models.Goal{
		UserId:       objID,
		CoderType:    params.CoderType,
		Birthday:     params.Birthday,
		MBTI:         params.MBTI,
		Workdays:     params.Workdays,
		Workstart:    params.Workstart,
		Workend:      params.Workend,
		Repos:        params.Repos,
		Productivity: params.Productivity,
		Stress:       params.Stress,
		UpdatedAt:    time.Now(),
	}
	doc, err := toDoc(userUpdate)
	if err != nil {
		fmt.Print(err)
	}
	update := bson.M{"$set": doc}
	opts := options.FindOneAndUpdate().SetUpsert(true)

	result := goalCollection.FindOneAndUpdate(context.TODO(), filter, update, opts)

	if result.Err() != nil {
		fmt.Println(result.Err())
	}

	var newResult models.Goal
	getErr := goalCollection.FindOne(context.TODO(), bson.M{"user_id": objID}).Decode(&newResult)

	if getErr != nil {
		fmt.Println(getErr)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "Onboard saved",
		"data":    newResult,
	})
	return
}

func UpdateRepoList(c *gin.Context) {
	var params OnboardUserParams
	c.Bind(&params)

	repos := c.PostForm("repos")
	uid := c.PostForm("uid")

	objID, err := primitive.ObjectIDFromHex(uid)
	filter := bson.M{"user_id": objID}
	userUpdate := bson.M{
		"repos":     repos,
		"updatedAt": time.Now(),
	}
	doc, err := toDoc(userUpdate)
	if err != nil {
		fmt.Print(err)
	}
	update := bson.M{"$set": doc}
	opts := options.FindOneAndUpdate().SetUpsert(true)

	result := goalCollection.FindOneAndUpdate(context.TODO(), filter, update, opts)

	if result.Err() != nil {
		fmt.Println(result.Err())
	}

	var newResult models.Goal
	getErr := goalCollection.FindOne(context.TODO(), bson.M{"user_id": objID}).Decode(&newResult)

	if getErr != nil {
		fmt.Println(getErr)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "Repolist saved",
		"data":    newResult,
	})
	return
}

func GetUserData(c *gin.Context) models.User {
	uid := c.Query("uid")

	objID, _ := primitive.ObjectIDFromHex(uid)
	var result models.User
	err := collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&result)

	if err != nil {
		fmt.Println("Error getting accesstoken")
	}

	return result
}

func GetUserGoal(c *gin.Context) models.Goal {
	uid := c.Query("uid")

	objID, _ := primitive.ObjectIDFromHex(uid)
	var result models.Goal
	err := goalCollection.FindOne(context.TODO(), bson.M{"user_id": objID}).Decode(&result)

	if err != nil {
		fmt.Println("Error getting goal")
	}

	return result
}

func GetUserGoalAPI(c *gin.Context) {
	uid := c.Query("uid")

	objID, _ := primitive.ObjectIDFromHex(uid)
	var result models.Goal
	err := goalCollection.FindOne(context.TODO(), bson.M{"user_id": objID}).Decode(&result)

	if err != nil {
		fmt.Println("Error getting goal")
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "success",
		"data":    result,
	})
	return
}
