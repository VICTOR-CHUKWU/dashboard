import { Page, Card, Table, Loader, CloudinaryUploadWidget } from "@components";
import React, { useState, useEffect } from "react";
import S from "./index.module.scss";


const Profile: React.FC = () => {
  const [tableLoad, setTableLoad] = useState(true);
  const [data, setData] = useState<any>(null);


  //load page
  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = () => {

    setTableLoad(true);

    setTableLoad(false);
  };


  return (
    <Page name={"Profile"}>
      {data ? (
        <div className={`${S.mainContainer}`}>
          <div className={`${S.profileContainer} mt-5`}>
            <div className={`${S.profileItem} ${S.topCurvedBorder} mt-3 `}>
              <div className={`${S.title}`}>USER ID:</div>
              <span className={`${S.content} pull-right`}>{data?.userId}</span>
            </div>
            <div className={`${S.profileItem}`}>
              <div className={`${S.title}`}>FULL NAME</div>
              <span className={`${S.content}`}>{data?.name}</span>
            </div>
            <div className={`${S.profileItem}`}>
              <div className={`${S.title}`}>PHONE NUMBER</div>
              <span className={`${S.content}`}>{data?.phone}</span>
            </div>
            <div className={`${S.profileItem}`}>
              <div className={`${S.title}`}>EMAIL</div>
              <span className={`${S.content}`}>{data?.email}</span>
            </div>
            <div className={`${S.profileItem}`}>
              <div className={`${S.title}`}>ADDRESS</div>
              <span className={`${S.content}`}>{data?.address}</span>
            </div>
          </div>
        </div>
      ) : (
        <Card name={""}>
          <div className={"col-lg-12"}>
            <Loader text={"Loading Profile"} />
          </div>
        </Card>
      )}
    </Page>
  );
};

export default Profile;
