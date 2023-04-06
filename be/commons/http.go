package commons

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type RequestObj struct {
	URL         string            `json:"url"`
	Method      string            `json:"method"`
	AccessToken string            `json:"access_token"`
	Queries     map[string]string `json:"queries"`
}

func MakeReq(c *gin.Context, httpReq RequestObj) []byte {
	client := &http.Client{}
	c.Header("Access-Control-Allow-Origin", "http://localhost:3000")

	method := httpReq.Method
	url := httpReq.URL
	token := httpReq.AccessToken
	queries := httpReq.Queries

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		log.Print(err)
		os.Exit(1)
	}

	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	q := req.URL.Query()
	// add queries
	for k, v := range queries {
		q.Add(k, v)
	}
	req.URL.RawQuery = q.Encode()
	resp, err := client.Do(req)

	if err != nil {
		log.Print(err)
	}
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	return resp_body
}
