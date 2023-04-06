import React, { useState } from "react";
import Header from "../../components/header";

import "./style.scss";
import AvaImg from "../../assets/ava.png"
import ISFPimg from "../../assets/ISFP.png"
import INFPimg from "../../assets/INFP.png"
import ENFJbanner from "../../assets/ENFJ_banner.png"
import { useSelector } from "react-redux";
import { Button, Stack } from "@mui/material";
import { personas } from "../onboard/steps/persona";
import { GitHub } from "@mui/icons-material";

const Profile = () => {
  const userData = useSelector((state: any) => state?.user?.user);
  const profileData = useSelector((state: any) => state?.profile.data);

  const devPersona = personas?.find((per) => per.key === profileData.coderType)
  return (
    <div className="ProfilePage">
      <div className="ProfilePage__content">
        <Stack direction={"column"} gap={3}>

          <Stack direction={"row"} gap={2} className="ProfilePage__content__top" justifyContent={"space-between"}>
            <Stack direction={"row"} gap={2}>
              <img src={devPersona?.ava ?? AvaImg} height={100} className="ProfilePage__content__ava" />
              <Stack direction={"column"} gap={1}>
                <h3>Hello, {userData?.login}</h3>
                <p>{userData?.bio}</p>
                <Stack direction={"row"} gap={2}>

                  <div className="profile-tag">{devPersona?.name}</div>
                  <div className="profile-tag profile-tag-neon">{profileData.mbti} - protagonist</div>
                </Stack>
              </Stack>
            </Stack>
            <Stack direction={"row"} gap={1} >
              <a href={userData.html_url} target="_blank" className="profile-tag profile-tag-button">
                <GitHub style={{ marginRight: 8 }} />
                Github
              </a>
            </Stack>
          </Stack>
          <Stack gap={2}>
            <Stack direction={"column"} gap={4} className="profile-content-box">
              <p className="subhead">BEST PAIRINGS</p>
              <Stack direction="row" gap={2}>
                <Stack gap={2}>
                  <Stack direction="row" gap={3}>
                    <img src={ISFPimg} className="profile-ava" />
                    <div className="profile-tag profile-tag-yellow">ISFP - adventurer</div>
                  </Stack>
                  <span>
                    {profileData.mbti}s and ISFPs can complement each other well because they have some important differences that can balance each other out.
                  </span><span>
                    {profileData.mbti}s tend to be outgoing and people-focused, with a strong desire to help others and make a positive impact on the world. They are also good at reading people and understanding their emotions.
                  </span>
                </Stack>
                <Stack gap={2}>
                  <Stack direction="row" gap={3}>
                    <img src={INFPimg} className="profile-ava" />
                    <div className="profile-tag profile-tag-neon">INFP - mediator</div>
                  </Stack>
                  <span>
                    Your particular style of communicating and interacting with others can be described fairly well by two dimensions: assertiveness and warmth.
                  </span><span>
                    Assertiveness describes your tendency to assert yourself, lead, and influence others in social situations, while warmth describes your tendencies to empathize and put others’ needs ahead of your own.
                  </span>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction={"column"} gap={4} className="profile-content-box">
              <p className="subhead">tips for</p>
              <Stack direction={"row"} gap={4}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <h1 className="profile-banner-text">{profileData.mbti}</h1>
                  <img src={ENFJbanner} className="profile-banner" />
                </div>
                <Stack style={{ flex: 1 }} gap={2}>
                  <span>
                    You are a natural leader who is driven to inspire and motivate others. To be productive and achieve your goals, you can use the tips in this article. Check it out!
                  </span>
                  <Button variant="outlined" style={{ width: 'max-content' }} href={`https://www.16personalities.com/${profileData.mbti}-personality`} target="_blank">read more</Button>
                </Stack>
              </Stack>

            </Stack>

          </Stack>


        </Stack>
      </div>
    </div >
  );
};

export default Profile;
