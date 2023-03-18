import React from "react";

export type EmptyProps = { message:string,icon?:string};

export const Empty: React.FC<EmptyProps> = ({ message,icon }) => {
  return <div className='d-flex w-100 flex-column justify-content-center align-items-center'>
    <div className='mb-2'>{icon}</div>
    <h3>{message}</h3>
  </div>;
};
