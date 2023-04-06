package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/violinyap/FYP/config"
	"github.com/violinyap/FYP/controllers"
)

func main() {
	r := gin.Default()

	config.InitDatabase()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH"},
		AllowHeaders:     []string{"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/", welcome)

	// USER API
	r.POST("/auth", controllers.AuthUser)
	r.POST("/onboard", controllers.OnboardUser)
	r.POST("/onboard/repos", controllers.UpdateRepoList)
	r.GET("/goal", controllers.GetUserGoalAPI)

	// REPO DASHBOARD API
	r.GET("/repos/all", controllers.GetAllRepos)
	r.GET("/repos/allcommit", controllers.GetAllReposCommits)
	r.GET("/repos/dash", controllers.GetAllDashboard)
	r.GET("/repos/goal", controllers.GetRepoListByGoal)

	// JOURNAL API
	r.POST("/journal", controllers.AddJournalEntry)
	r.GET("/journal", controllers.GetJournalInfo)
	r.GET("/journal/history", controllers.GetPastJournal)

	// TODO API
	r.POST("/todo/new", controllers.AddTodoEntry)
	r.POST("/todo/update", controllers.ChangeTodoEntry)
	r.GET("/todo", controllers.GetTodos)

	r.Run()
}

func welcome(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  200,
		"message": "Welcome to com.it",
	})
	return
}
