package controllers

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type Owner struct {
	ID        string `json:"id"`
	Login     string `json:"login"`
	AvatarURL string `json:"avatar_url"`
	Url       bool   `json:"url"`
	HTMLUrl   string `json:"html_url"`
}

type Repository struct {
	ID              int          `json:"id"`
	Name            string       `json:"name"`
	FullName        string       `json:"full_name"`
	Private         bool         `json:"private"`
	HTMLUrl         string       `json:"html_url"`
	Description     string       `json:"description"`
	Fork            bool         `json:"fork"`
	Visibility      string       `json:"visibility"`
	Owner           Owner        `json:"owner"`
	ForksCount      int          `json:"forks_count"`
	StargazersCount int          `json:"stargazers_count"`
	WatchersCount   int          `json:"watchers_count"`
	Size            int          `json:"size"`
	OpenIssuesCount int          `json:"open_issues_count"`
	BranchCount     int          `json:"branches_count"`
	CommitData      RepoStatsRes `json:"commit_data"`
	PullRequests    []PRData     `json:"pulls"`
}

type CommitRes struct {
	Sha         string `json:"sha"`
	Url         string `json:"url"`
	HTMLUrl     string `json:"html_url"`
	CommentsUrl string `json:"comments_url"`
	Commit      Commit `json:"commit"`
	Author      Owner  `json:"author"`
	Committer   Owner  `json:"committer"`
}

type Commit struct {
	Sha          string `json:"sha"`
	Url          string `json:"url"`
	Author       User   `json:"author"`
	Committer    User   `json:"committter"`
	Message      string `json:"message"`
	CommentCount int    `json:"comment_count"`
}

type CommitStats struct {
	Addition int `json:"additions"`
	Deletion int `json:"deletions"`
}

type FileList struct {
	Filename string `json:"filename"`
	Changes  int    `json:"changes"`
}

type CommitResDetail struct {
	Url         string      `json:"url"`
	HTMLUrl     string      `json:"html_url"`
	CommentsUrl string      `json:"comments_url"`
	Commit      Commit      `json:"commit"`
	Author      Owner       `json:"author"`
	Committer   Owner       `json:"committer"`
	Stats       CommitStats `json:"stats"`
	Files       []FileList  `json:"files"`
}

type CommitForProcess struct {
	Addition int    `json:"additions"`
	Deletion int    `json:"deletions"`
	Date     string `json:"date"`
	Message  string `json:"message"`
}

type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Date  string `json:"date"`
}

type EventPayload struct {
	Ref     string   `json:"ref"`
	Commits []Commit `json:"commits"`
}

type Event struct {
	Type    string       `json:"type"`
	Payload EventPayload `json:"payload"`
}

type RepoStatsRes struct {
	CommitTypes map[string]int `json:"commit_types"`
	Languages   []LanguageData `json:"languages"`
	AllStats    CommitStats    `json:"all_stats"`
	CommitCount int            `json:"commit_count"`
}

type CommitType struct {
	Type    string `json:"type"`
	Count   int    `json:"count"`
	Percent int    `json:"percent"`
}

type LanguageData struct {
	Lang string `json:"lang"`
	Size int    `json:"size"`
}

type IssueData struct {
	Title string `json:"title"`
	State string `json:"state"`
	Body  string `json:"body"`
}

type BranchData struct {
	Name string `json:"name"`
	// Description string `json:"description"`
}
type PRData struct {
	State string `json:"state"`
	Title string `json:"title"`
}

type CountData struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type RepoInfo struct {
	ID    int    `json:"id"`
	Owner Owner  `json:"owner"`
	Name  string `json:"name"`
}

func GetAllUserRepo(c *gin.Context, access_token string) []Repository {
	client := &http.Client{}

	req, err := http.NewRequest("GET", "https://api.github.com/user/repos", nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	q := req.URL.Query()
	q.Add("sort", "pushed")
	// q.Add("visibility", "private")
	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)

	if err != nil {
		log.Print(err)
	}
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var data []Repository
	json.Unmarshal(resp_body, &data)

	defer resp.Body.Close()

	return data
}

func GetAllRepos(c *gin.Context) {
	access_token := GetUserData(c).Token

	c.JSON(http.StatusOK, gin.H{
		"error_code": 200,
		"message":    "success",
		"data":       GetAllUserRepo(c, access_token),
	})
}

func GetARepo(c *gin.Context, access_token string, repo string, owner string) Repository {
	client := &http.Client{}

	// GET A COMMIT
	reqUrl := []string{"https://api.github.com/repos", owner, repo}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := client.Do(req)
	if err != nil {
		log.Print(err)
	}

	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var repoData Repository
	json.Unmarshal(resp_body, &repoData)
	defer resp.Body.Close()

	return repoData
}

func GetRepoListByGoal(c *gin.Context) {
	userData := GetUserData(c)
	access_token := userData.Token

	userGoals := GetUserGoal(c)
	repoIdStr := userGoals.Repos
	repoArrs := strings.Split(repoIdStr, ",")

	allRepos := GetAllUserRepo(c, access_token)
	repoById := make(map[string]Repository)

	for _, repoDetail := range allRepos {
		repoById[strconv.Itoa(repoDetail.ID)] = repoDetail
	}

	if len(repoIdStr) > 0 && len(repoArrs) > 0 {
		var reposData []Repository
		// get list of selected repos duls
		for _, repoID := range repoArrs {
			reposData = append(reposData, repoById[repoID])
		}

		c.JSON(http.StatusOK, gin.H{
			"error_code": 200,
			"message":    "success",
			"data":       reposData,
		})

	} else {
		c.JSON(http.StatusOK, gin.H{
			"error_code": 200,
			"message":    "no repository selected",
			"data":       nil,
		})
	}
}

func GetAllDashboard(c *gin.Context) {
	userData := GetUserData(c)
	access_token := userData.Token

	userGoals := GetUserGoal(c)
	repoIdStr := userGoals.Repos
	repoArrs := strings.Split(repoIdStr, ",")

	allRepos := GetAllUserRepo(c, access_token)
	repoById := make(map[string]Repository)

	for _, repoDetail := range allRepos {
		repoById[strconv.Itoa(repoDetail.ID)] = repoDetail
	}

	if len(repoIdStr) > 0 && len(repoArrs) > 0 {
		var reposData []Repository
		// get list of selected repos duls
		for _, repoID := range repoArrs {
			repoName := repoById[repoID].Name
			repoOwner := repoById[repoID].Owner.Login
			// get a repo
			repoData := GetARepo(c, access_token, repoName, repoOwner)
			// get no of branch
			branchData := GetReposBranches(c, access_token, repoName, repoOwner)
			// get no of commit
			commitsData := GetReposStats(c, access_token, repoName, repoOwner)
			// get no of PR
			prData := GetRepoPullRequest(c, access_token, repoName, repoOwner)

			reposData = append(reposData, Repository{
				ID:              repoData.ID,
				Name:            repoData.Name,
				FullName:        repoData.FullName,
				Private:         repoData.Private,
				HTMLUrl:         repoData.HTMLUrl,
				Description:     repoData.Description,
				Fork:            repoData.Fork,
				Visibility:      repoData.Visibility,
				Owner:           repoData.Owner,
				ForksCount:      repoData.ForksCount,
				StargazersCount: repoData.StargazersCount,
				WatchersCount:   repoData.WatchersCount,
				Size:            repoData.Size,
				OpenIssuesCount: repoData.OpenIssuesCount,
				BranchCount:     len(branchData),
				CommitData:      commitsData,
				PullRequests:    prData,
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"error_code": 200,
			"message":    "success",
			"data":       reposData,
			"repo_count": len(allRepos),
		})

	} else {
		c.JSON(http.StatusOK, gin.H{
			"error_code": 200,
			"message":    "no repository selected",
			"data":       nil,
		})
	}
}

func GetReposCommit(c *gin.Context) {
	access_token := GetUserData(c).Token
	author := c.Query("author")
	owner := c.Query("owner")
	repo := c.Query("repo")

	client := &http.Client{}

	reqUrl := []string{"https://api.github.com/repos", owner, repo, "commits"}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	q := req.URL.Query()
	q.Add("author", author)

	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)

	if err != nil {
		log.Print(err)
	}
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var data []CommitRes
	json.Unmarshal(resp_body, &data)

	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{
		"error_code": 200,
		"message":    "success",
		"data":       data,
	})
}

func GetReposStats(c *gin.Context, access_token string, repo string, owner string) RepoStatsRes {

	var DataRes RepoStatsRes

	commitsShas := GetReposEvents(c, access_token, repo, owner)
	c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
	author := c.Query("author")
	var AllCommits []CommitForProcess

	for _, commitSHA := range commitsShas {
		commitDetail := GetCommitDetail(c, access_token, repo, owner, commitSHA)
		if commitDetail.Author.Login == author {
			newCommit := CommitForProcess{
				Addition: commitDetail.Stats.Addition,
				Deletion: commitDetail.Stats.Deletion,
				Date:     commitDetail.Commit.Author.Date,
				Message:  commitDetail.Commit.Message,
			}
			AllCommits = append(AllCommits, newCommit)
		}
	}

	totalAdd := 0
	totalDel := 0
	totalCommit := len(AllCommits)
	var messages []string
	messageCount := make(map[string]int)

	// SUM ADDS AND DELS OF COMMITS
	for _, commit := range AllCommits {
		totalAdd = totalAdd + commit.Addition
		totalDel = totalDel + commit.Deletion
		commitType := strings.Split(commit.Message, " ")[0]
		messageCount[commitType] = messageCount[commitType] + 1
		if messageCount[commitType] == 1 {
			messages = append(messages, commitType)
		}
	}

	// GET LANGUAGE DATA
	langData := GetReposLanguage(c, access_token, repo, owner)

	DataRes = RepoStatsRes{
		Languages: langData,
		AllStats: CommitStats{
			Addition: totalAdd,
			Deletion: totalDel,
		},
		CommitTypes: messageCount,
		CommitCount: totalCommit,
	}

	return DataRes
}

func GetCommitDetail(c *gin.Context, access_token string, repo string, owner string, sha string) CommitResDetail {
	client := &http.Client{}

	// GET A COMMIT
	reqUrl := []string{"https://api.github.com/repos", owner, repo, "commits", sha}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := client.Do(req)
	if err != nil {
		log.Print(err)
	}

	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var commit CommitResDetail
	json.Unmarshal(resp_body, &commit)
	defer resp.Body.Close()

	return commit

}

func GetAllReposCommits(c *gin.Context) {
	access_token := GetUserData(c).Token

	owner := c.Query("owner")
	author := c.Query("author")
	repo := c.Query("repo")

	commitsShas := GetReposEvents(c, access_token, repo, owner)

	var AllCommits []CommitResDetail

	for _, commitSHA := range commitsShas {
		commitDetail := GetCommitDetail(c, access_token, repo, owner, commitSHA)
		if commitDetail.Author.Login == author {

			AllCommits = append(AllCommits, commitDetail)
		}
	}
	langData := GetReposLanguage(c, access_token, repo, owner)
	issueData := GetReposIssues(c, access_token, repo, owner)
	branchData := GetReposBranches(c, access_token, repo, owner)

	c.JSON(http.StatusOK, gin.H{
		"error_code": 200,
		"message":    "success",
		"data": gin.H{
			"commits": AllCommits,
			"lang":    langData,
			"issue":   issueData,
			"branch":  branchData,
		},
	})
}

func GetReposEvents(c *gin.Context, access_token string, repo string, owner string) []string {

	client := &http.Client{}
	var commitShas []string

	// GET ALL COMMITS FROM REPO
	reqUrl := []string{"https://api.github.com/repos", owner, repo, "events"}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	fetchAgain := true
	pageNum := 1

	for fetchAgain {
		q := req.URL.Query()
		q.Add("per_page", "100")
		q.Add("page", strconv.Itoa(pageNum))
		req.URL.RawQuery = q.Encode()
		resp, err := client.Do(req)

		if err != nil {
			log.Print(err)
		}
		resp_body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Print(err)
		}

		var events []Event
		json.Unmarshal(resp_body, &events)

		defer resp.Body.Close()

		for _, event := range events {
			if event.Type == "PushEvent" {
				for _, commit := range event.Payload.Commits {
					commitShas = append(commitShas, commit.Sha)
				}
			}
		}

		if len(events) >= 99 {
			pageNum += 1
		} else {
			fetchAgain = false
		}
	}
	return commitShas
}

func GetReposLanguage(c *gin.Context, access_token string, repo string, owner string) []LanguageData {

	client := &http.Client{}

	// GET ALL COMMITS FROM REPO
	reqUrl := []string{"https://api.github.com/repos", owner, repo, "languages"}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := client.Do(req)

	if err != nil {
		log.Print(err)
	}
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var languages map[string]int
	json.Unmarshal(resp_body, &languages)

	defer resp.Body.Close()

	var langDataRes []LanguageData

	for key, val := range languages {
		langObj := LanguageData{
			Lang: key,
			Size: val,
		}

		langDataRes = append(langDataRes, langObj)
	}

	return langDataRes
}

func GetReposIssues(c *gin.Context, access_token string, repo string, owner string) []IssueData {
	client := &http.Client{}

	// GET ALL ISSUES FROM REPO
	reqUrl := []string{"https://api.github.com/repos", owner, repo, "issues"}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}

	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	q := req.URL.Query()
	q.Add("state", "all")
	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)

	if err != nil {
		log.Print(err)
	}
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var issues []IssueData
	json.Unmarshal(resp_body, &issues)

	defer resp.Body.Close()

	return issues
}

func GetReposBranches(c *gin.Context, access_token string, repo string, owner string) []BranchData {

	client := &http.Client{}

	// GET ALL BRANCHES FROM REPO
	reqUrl := []string{"https://api.github.com/repos", owner, repo, "branches"}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := client.Do(req)

	if err != nil {
		log.Print(err)
	}
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var branches []BranchData
	json.Unmarshal(resp_body, &branches)

	defer resp.Body.Close()

	return branches
}

func GetRepoPullRequest(c *gin.Context, access_token string, repo string, owner string) []PRData {

	client := &http.Client{}

	// GET ALL BRANCHES FROM REPO
	reqUrl := []string{"https://api.github.com/repos", owner, repo, "pulls"}
	req, err := http.NewRequest("GET", strings.Join(reqUrl, "/"), nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+access_token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := client.Do(req)

	if err != nil {
		log.Print(err)
	}
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	var pullReqs []PRData
	json.Unmarshal(resp_body, &pullReqs)

	defer resp.Body.Close()

	return pullReqs
}
