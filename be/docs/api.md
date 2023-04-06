# API

Roughly follows [REST API](https://restfulapi.net/).
HTTP Method used:

| HTTP Method | CRUD Equivalent |
| ----------- | --------------- |
| POST        | Create          |
| GET         | Read            |
| PUT         | Update          |
| DELETE      | Delete          |

## Message Format

```json
{
  "error_code": 0,
  "message": "success",
  "data": {
    "_id": "637f7f8c2ef4eecf067224da",
    "name": "myname",
    "email": "myemail@mail.com",
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "username": "usernames",
    "bio": "this is the bio",
    "last_login": "2008-01-14T04:33:35Z"
  }
}
```

### Error Code

| Code | Meaning        |
| ---- | -------------- |
| 200  | Success        |
| 400  | Bad Request    |
| 404  | Not Found      |
| 403  | Not Authorized |

## Authentication and Authorisation

## API List

### User

#### `POST /auth`

Get access token from Github OAUTH and register user to database if user was not registered. (Save access token and user data in db)
Return user data.

Reference: https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps

Request Body:

| Parameter Name | Type   | Required | Description                     |
| -------------- | ------ | -------- | ------------------------------- |
| `code`         | string | Yes      | Code returned from github login |

Response Data

```json
{
  "user": {
    "_id": "637f7f8c2ef4eecf067224da", // required
    "name": "myname",
    "email": "myemail@mail.com",
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "username": "usernames", // required
    "url": "https://api.github.com/users/octocat",
    "html_url": "https://github.com/octocat",
    "bio": "this is the bio",
    "last_login": "2008-01-14T04:33:35Z"
  },
  "new": true
}
```

#### `POST /logout`

Remove access token of user from db

Request Body:

| Parameter Name | Type   | Required | Description |
| -------------- | ------ | -------- | ----------- |
| `user_id`      | string | Yes      | User id     |

Response Data

```json
{
  "data": {}
}
```

## Github Data

## API List

### Repository

#### `GET /repos/all`

Get all repository of registered user

GITHUB: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user

API: https://api.github.com/user/repos

Request Params:

| Parameter Name | Type   | Required | Description |
| -------------- | ------ | -------- | ----------- |
| `user_id`      | string | Yes      | User id     |

Response Data

```json
{
  "data": [
    {
      "id": 1296269,
      "name": "Hello-World",
      "full_name": "octocat/Hello-World",
      "owner": {
        "username": "octocat",
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat"
      },
      "private": false,
      "html_url": "https://github.com/octocat/Hello-World",
      "description": "This your first repo!",
      "language": null,
      "fork": false,
      "stats": {
        "forks_count": 9,
        "forks": 9,
        "stargazers_count": 80,
        "watchers_count": 80,
        "watchers": 80,
        "size": 108,
        "open_issues_count": 0,
        "open_issues": 0
      },
      "visibility": "public",
      "pushed_at": "2011-01-26T19:06:43Z",
      "created_at": "2011-01-26T19:01:12Z",
      "updated_at": "2011-01-26T19:14:43Z"
    }
  ]
}
```

#### `GET /repos/commit`

Get latest commit of registered user from chosen repository

GITHUB: https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28

API: https://api.github.com/repos/OWNER/REPO/commits,

Request Params:

| Parameter Name | Type   | Required | Description                  |
| -------------- | ------ | -------- | ---------------------------- |
| `user_id`      | string | Yes      | User id                      |
| `author`       | string | No       | Login/username of committer  |
| `owner`        | string | Yes      | Login/username of repo owner |
| `repo`         | string | Yes      | Repo name                    |
| `since`        | string | No       | Limit date of commit         |

Response Data

```json
{
  "data": [
    {
      "url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
      "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
      "html_url": "https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e",
      "comments_url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments",
      "commit": {
        "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
        "author": {
          "name": "Monalisa Octocat",
          "email": "mona@github.com",
          "date": "2011-04-14T16:00:49Z"
        },
        "committer": {
          "name": "Monalisa Octocat",
          "email": "mona@github.com",
          "date": "2011-04-14T16:00:49Z"
        },
        "message": "Fix all the bugs",
        "comment_count": 0
      },
      "author": {
        "login": "octocat",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat"
      },
      "committer": {
        "login": "octocat",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat"
      },
      "parents": [
        {
          "url": "https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e"
        }
      ],
      "stats": {
        "additions": 104,
        "deletions": 4,
        "total": 108
      }
    }
  ]
}
```

#### `GET /repos/stats`

Get metrics stats for dashboard of repository

GITHUB: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-languages

API: https://api.github.com/repos/OWNER/REPO/commits,

Request Params:

| Parameter Name | Type   | Required | Description                  |
| -------------- | ------ | -------- | ---------------------------- |
| `user_id`      | string | Yes      | User id                      |
| `author`       | string | No       | Login/username of committer  |
| `owner`        | string | Yes      | Login/username of repo owner |
| `repo`         | string | Yes      | Repo name                    |
| `since`        | string | No       | Limit date of commit         |

Response Data

```json
{
  "data": {
    "productivity": 4.2,
    "fav_day": "Monday",
    "avg_stats": {
      "additions": 104,
      "deletions": 4
    },
    "commit_types": [
      {
        "type": "Fix",
        "count": 343,
        "percent": 30
      },
      {
        "type": "Merge",
        "count": 243,
        "percent": 20
      },
      {
        "type": "Add",
        "count": 143,
        "percent": 10
      }
    ],
    "languages": [
      {
        "lang": "C",
        "size": 78769,
        "percent": 10
      },
      {
        "lang": "C+",
        "size": 78769,
        "percent": 10
      }
    ],
    "time_commit": {
      "0-1": 10,
      "1-2": 1,
      "2-3": 6,
      // ...
      "10-11": 2,
      // ...
      "23-24": 8
    },
    "all_stats": {
      "additions": 104,
      "deletions": 4
    },
    "date_commit": [
      {
        "date": "2011-04-14",
        "count": 3
      },
      {
        "date": "2011-04-15",
        "count": 2
      }
    ]
  }
}
```
