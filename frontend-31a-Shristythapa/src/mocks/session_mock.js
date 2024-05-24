const session_mock = [
  {
    _id: {
      $oid: "65e03eff6c3ae053a05343ee",
    },
    mentorId: {
      $oid: "65e03e306c3ae053a05343e5",
    },
    mentor: {
      name: "Finley Michael",
      email: "michael@gmail.com",
    },
    title: "Flutter dev tools",
    description: "Dart & Flutter DevTools Extensions",
    date: {
      $date: "2024-03-08T00:00:00.000Z",
    },
    startTime: "14:00",
    endTime: "16:00",
    noOfAttendesSigned: 0,
    maxNumberOfAttendesTaking: 9,
    isOngoing: false,
    attendesSigned: [],
    __v: 0,
  },
  {
    _id: {
      $oid: "65e1110e20ee29eef3dfde3f",
    },
    mentorId: {
      $oid: "65e03e306c3ae053a05343e5",
    },
    mentor: {
      name: "Finley Michael",
      email: "michael@gmail.com",
    },
    title: "Intro to Flutter",
    description:
      "This course will introduce learners to the Flutter framework with interactive lessons on basic app components.",
    date: {
      $date: "2024-03-02T00:00:00.000Z",
    },
    startTime: "5:00 AM",
    endTime: "8:00 AM",
    noOfAttendesSigned: 4,
    maxNumberOfAttendesTaking: 10,
    isOngoing: false,
    attendesSigned: [
      {
        email: "mentor@example.com",
        _id: {
          $oid: "65e40047efa11a516e86ccbd",
        },
      },
    ],
    __v: 5,
  },
  {
    _id: {
      $oid: "65e12d765fc574b370f7a330",
    },
    mentorId: {
      $oid: "65e03e306c3ae053a05343e5",
    },
    mentor: {
      name: "Finley Michael",
      email: "michael@gmail.com",
    },
    title: "React ",
    description: "learn react for mobile app development ",
    date: {
      $date: "2024-03-30T00:00:00.000Z",
    },
    startTime: "7:05 AM",
    endTime: "10:05 AM",
    noOfAttendesSigned: 5,
    maxNumberOfAttendesTaking: 9,
    isOngoing: false,
    attendesSigned: [
      {
        email: "Cooper@gmail.com",
        _id: {
          $oid: "65e3bf739018d258107db7de",
        },
      },
    ],
    __v: 5,
  },
  {
    _id: {
      $oid: "65e191adb5cc674935a01e4a",
    },
    mentorId: {
      $oid: "65e19102b5cc674935a01e42",
    },
    mentor: {
      name: "saylor",
      email: "saylor@gmail.com",
    },
    title: "Figma",
    description:
      "Learn Web Design online at your own pace. Start today and improve your skills.",
    date: {
      $date: "2024-03-10T00:00:00.000Z",
    },
    startTime: "2:15 PM",
    endTime: "5:15 PM",
    noOfAttendesSigned: 0,
    maxNumberOfAttendesTaking: 15,
    isOngoing: false,
    attendesSigned: [],
    __v: 0,
  },
  {
    _id: {
      $oid: "65e3ccdc9018d258107db7ec",
    },
    mentorId: {
      $oid: "65e3cc389018d258107db7e3",
    },
    mentor: {
      name: "Summer",
      email: "summer@gmail.com",
    },
    title: "How to get Starred with AI ",
    description:
      "Learn how to Develop an in-depth understanding of machine learning models and learn to apply them to real-world problems ",
    date: {
      $date: "2024-03-30T00:00:00.000Z",
    },
    startTime: "07:00",
    endTime: "12:00",
    noOfAttendesSigned: 1,
    maxNumberOfAttendesTaking: 19,
    isOngoing: false,
    attendesSigned: [
      {
        email: "cooper@gmail.com",
        _id: {
          $oid: "65e3d07243505b34f8db656d",
        },
      },
    ],
    __v: 1,
  },
];

export default session_mock;