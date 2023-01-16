import React from "react";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetails from "@/components/meetups/MeetupDetails";

const meetupDetails = (props) => {
  return (
    <MeetupDetails
      title={props.meetupData.title}
      description={props.meetupData.description}
      id={props.meetupData._id}
      image={props.meetupData.image}
      address={props.meetupData.address}
    />
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://rohitEoxys_0:rohitsharma@cluster0.wholyvy.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetups) => ({
      params: { meetupId: meetups._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://rohitEoxys_0:rohitsharma@cluster0.wholyvy.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default meetupDetails;
