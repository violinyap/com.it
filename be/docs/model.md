# Models

## User

```json
{
  "_id": 1,
  "github_id": "582915",
  "name": "",
  "username": "usnmae",
  "email": "abraham@gmail.com",
  "avatar_url": "https://avatars.githubusercontent.com/u/58291519?v=4",
  "profile_url": "",
  "access_token": "gho_HvHPqxhp0Pb2GGRlwK0X25Sz",
  "bio": "",
  "last_login": "2022-12-21T15:18:35.311+00:00"
}
```

## Journal

```json
{
  "id": 1,
  "user_id": 2,
  "type": "productivity",
  "answers": {
    "0": ["Unplanned tasks"],
    "1": ["Better time management", "Better prioritization"],
    "2": ["Lack of clarity on requirements", "Lack of resources"],
    "3": "no",
    "4": "no",
    "5": 8,
    "6": 4,
    "7": 7,
    "8": 8
  },
  "score": "1.3",
  "date": "2022-12-21"
}
```

## Goal

```json
{
  "id": 1,
  "user_id": "2",
  "coder_type": "owl",
  "birthday": "2001-08-29",
  "mbti": "ISTP",
  "wdays": "Mon,Tue,Wed,Thu,Fri,Sat",
  "wstart": "07:30",
  "wend": "19:00",
  "productivity": 6,
  "stress": 4,
  "repos": "123434,21321312"
}
```

## Todo

```json
{
  "id": 1,
  "user_id": "2",
  "type": "work",
  "task": "code more",
  "completed": false,
  "completedAt": "2023-03-24T07:15:58.141+00:00",
  "createdAt": "2023-03-22T05:43:21.168+00:00"
}
```
