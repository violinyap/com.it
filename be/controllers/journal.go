package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/violinyap/FYP/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func AddJournalEntry(c *gin.Context) {

	journalType := c.PostForm("type")
	answers := c.PostForm("answers")
	score := c.PostForm("score")
	uid := c.PostForm("uid")
	currentTime := time.Now()

	objID, err := primitive.ObjectIDFromHex(uid)

	newJournal := models.Journal{
		Type:      journalType,
		Answers:   answers,
		Score:     score,
		Date:      currentTime.Format("2006-01-02"),
		UserId:    objID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	result, err := journalCollection.InsertOne(context.TODO(), newJournal)

	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "Journal saved",
		"data":    result,
	})
	return
}

func GetJournalInfo(c *gin.Context) {
	uid := c.Query("uid")
	currentTime := time.Now()

	objID, _ := primitive.ObjectIDFromHex(uid)

	var prodResult models.Journal
	var stressResult models.Journal
	err := journalCollection.FindOne(context.TODO(),
		bson.M{
			"user_id": objID,
			"date":    currentTime.Format("2006-01-02"),
			"type":    "productivity",
		}).Decode(&prodResult)
	err = journalCollection.FindOne(context.TODO(),
		bson.M{
			"user_id": objID,
			"date":    currentTime.Format("2006-01-02"),
			"type":    "stress",
		}).Decode(&stressResult)

	if err != nil {
		fmt.Println("Error getting journal", currentTime.Format("2006-01-02"), err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "success",
		"data": gin.H{
			"prod":   prodResult,
			"stress": stressResult,
		},
	})
	return
}

func GetPastJournal(c *gin.Context) {
	uid := c.Query("uid")

	objID, _ := primitive.ObjectIDFromHex(uid)

	filter := bson.M{"user_id": objID}
	cursor, err := journalCollection.Find(context.TODO(), filter)

	if err != nil {
		fmt.Println("Error getting journals", err)
	}

	var results []models.Journal
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var prodJournals []models.Journal
	var stressJournals []models.Journal
	var journalEntries []string
	for _, result := range results {
		if result.Type == "productivity" {
			prodJournals = append(prodJournals, result)
		}
		if result.Type == "stress" {
			stressJournals = append(stressJournals, result)
		}

		journalEntries = append(journalEntries, result.Date)
	}

	todoResults := GetTodosUtil(c)

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "success",
		"data": gin.H{
			"prod":     prodJournals,
			"stress":   stressJournals,
			"todo":     todoResults,
			"journals": journalEntries,
		},
	})
	return
}

func AddTodoEntry(c *gin.Context) {

	task := c.PostForm("task")
	todoType := c.PostForm("type")
	uid := c.PostForm("uid")

	objID, err := primitive.ObjectIDFromHex(uid)

	newTodo := models.Todo{
		Type:      todoType,
		Task:      task,
		UserId:    objID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	result, err := todoCollection.InsertOne(context.TODO(), newTodo)

	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "Todo saved",
		"data":    result,
	})
	return
}

func ChangeTodoEntry(c *gin.Context) {

	completed := c.PostForm("completed")
	todoID := c.PostForm("todo_id")

	objID, err := primitive.ObjectIDFromHex(todoID)

	filter := bson.M{"_id": objID}
	todoUpdate := bson.M{
		"updatedAt": time.Now(),
	}

	if completed == "true" {
		todoUpdate = bson.M{
			"completed":   true,
			"completedAt": time.Now(),
			"updatedAt":   time.Now(),
		}
	} else {
		todoUpdate = bson.M{
			"completed": false,
			"updatedAt": time.Now(),
		}
	}
	doc, err := toDoc(todoUpdate)
	if err != nil {
		fmt.Print(err)
	}
	update := bson.M{"$set": doc}
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	var result models.Todo
	err = todoCollection.FindOneAndUpdate(context.TODO(), filter, update, opts).Decode(&result)

	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "Todo updated",
		"data":    result,
	})
	return
}

func GetTodos(c *gin.Context) {

	uid := c.Query("uid")

	objID, _ := primitive.ObjectIDFromHex(uid)

	filter := bson.M{"user_id": objID}
	cursor, err := todoCollection.Find(context.TODO(), filter)

	if err != nil {
		fmt.Println("Error getting todos", err)
	}

	var results []models.Todo
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "success",
		"data":    results,
	})
	return
}

func GetTodosUtil(c *gin.Context) []models.Todo {

	uid := c.Query("uid")

	objID, _ := primitive.ObjectIDFromHex(uid)

	filter := bson.M{"user_id": objID}
	cursor, err := todoCollection.Find(context.TODO(), filter)

	if err != nil {
		fmt.Println("Error getting todos", err)
	}

	var results []models.Todo
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	return results
}
