export type Paper = {
    id: string;
    title: string;
    authors: string;
    year: number;
    venue: string;
    keywords: string[];
    summary: string;
    relevanceToProject: string;
  };
  
  export const papers: Paper[] = [
    {
      id: "paper-1",
      title:
        "One small step for a robot, one giant leap for habitat monitoring: A structural survey of EU forest habitats with Robotically-mounted Mobile Laser Scanning (RMLS)",
      authors:
        "Leopoldo de Simone, Emanuele Fanfarillo, Simona Maccherini, Tiberio Fiaschi, Giuseppe Alfonso, Franco Angelini, Manolo Garabini, Claudia Angiolini",
      year: 2024,
      venue: "Ecological Indicators, Volume 160, Article 111882",
      keywords: [
        "robotic monitoring",
        "habitat monitoring",
        "mobile laser scanning",
        "environmental sensing",
        "field robotics",
      ],
      summary:
        "This paper presents the use of Robotically-mounted Mobile Laser Scanning to survey structural properties of EU forest habitats. It shows how a robotic platform can collect environmental and habitat-related data in a systematic and repeatable way.",
      relevanceToProject:
        "This paper is relevant because EcoSense Lab also uses robot-collected environmental data for monitoring. The project is in a controlled Industry 4.0 lab rather than a forest, but the principle of using a mobile robotic platform for environmental sensing is similar.",
    },
    {
      id: "paper-2",
      title: "Robotic Monitoring of Habitats: The Natural Intelligence Approach",
      authors:
        "Franco Angelini, Pierangela Angelini, Claudia Angiolini, Simonetta Bagella, Marco Caccianiga, and others",
      year: 2023,
      venue: "IEEE Access, Volume 11, pages 72575–72591",
      keywords: [
        "robotic monitoring",
        "habitat monitoring",
        "environmental monitoring",
        "field robots",
        "ecological observation",
      ],
      summary:
        "This article discusses robotic habitat monitoring and presents the Natural Intelligence approach, which combines robot design, environmental interaction, and autonomous monitoring. It shows how robots can support ecological observation in natural environments.",
      relevanceToProject:
        "This supports EcoSense Lab's main idea: robots can act as environmental monitoring platforms. In the project, the lab robot/sensor system collects abiotic environmental readings such as temperature, humidity, and pressure.",
    },
    {
      id: "paper-3",
      title: "WSN Architectures for Environmental Monitoring Applications",
      authors:
        "Kofi Sarpong Adu-Manu, Jamal-Deen Abdulai, Felicia Engmann, Moses Akazue, John Kwaku Appati, George Eduful Baiden, and Grace Sarfo-Kantanka",
      year: 2022,
      venue: "Journal of Sensors, Volume 2022, Article ID 7823481",
      keywords: [
        "wireless sensor networks",
        "environmental monitoring",
        "sensor architecture",
        "IoT",
        "sensor data",
      ],
      summary:
        "This paper reviews wireless sensor network architectures for environmental monitoring applications. It explains how sensors and communication systems can be organized to collect environmental data over time.",
      relevanceToProject:
        "EcoSense Lab is not a full wireless sensor network, but it shares the same monitoring goal: collecting environmental data from sensors and presenting it for analysis through a dashboard.",
    },
    {
      id: "paper-4",
      title:
        "Applications of Wireless Sensor Networks in Marine Environment Monitoring: A Survey",
      authors: "Guobao Xu, Weiming Shen, Xianbin Wang",
      year: 2014,
      venue: "Sensors, Volume 14, Issue 9, pages 16932–16954",
      keywords: [
        "wireless sensor networks",
        "environmental monitoring",
        "sensor data",
        "real-time monitoring",
        "monitoring systems",
      ],
      summary:
        "This survey discusses how wireless sensor networks are used for marine environmental monitoring. It describes sensor-based monitoring systems, data collection, communication, and continuous observation of environmental conditions.",
      relevanceToProject:
        "Although this paper focuses on marine environments, the monitoring principle is similar: sensor readings are collected, organized, and visualized to understand environmental conditions.",
    },
    {
      id: "paper-5",
      title:
        "Designing a Remote Room Monitoring System with an ESP8266 Board and BME280 Sensor",
      authors: "Gergana Spasova and others",
      year: 2025,
      venue: "Engineering Proceedings, MDPI",
      keywords: [
        "BME280",
        "temperature",
        "humidity",
        "pressure",
        "room monitoring",
        "IoT monitoring",
      ],
      summary:
        "This paper presents a remote room monitoring system using an ESP8266 board and a BME280 environmental sensor. The BME280 measures temperature, humidity, and pressure, which are sent for monitoring and analysis.",
      relevanceToProject:
        "This is highly relevant to EcoSense Lab because the project uses the same type of abiotic environmental variables: temperature, humidity, and pressure in a controlled lab environment.",
    },
  ];