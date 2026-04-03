import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Flame,
  Grid3X3,
  Heart,
  LogOut,
  Search,
  Settings,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActorWithConfig } from "../config";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { HWBackend, HotWheelsCar } from "../types/hotwheels";
import AdminPanel from "./AdminPanel";
import CarCard from "./CarCard";
import CarDetailModal from "./CarDetailModal";

type Tab = "catalog" | "favorites" | "admin";

// Hot Wheels year range (brand started in 1968)
const HW_START_YEAR = 1968;
const CURRENT_YEAR = new Date().getFullYear();

function allHWYears(): string[] {
  const years: string[] = [];
  for (let y = CURRENT_YEAR; y >= HW_START_YEAR; y--) {
    years.push(String(y));
  }
  return years;
}

const SEED_CARS: HotWheelsCar[] = [
  // --- Classics (1968-1979) ---
  {
    id: BigInt(1),
    name: "Hot Heap",
    model: "Hot Heap",
    year: BigInt(1968),
    series: "Original 16",
    scale: "1:64",
    color: "Orange",
    tampo: "",
    description:
      "One of the Original 16 Hot Wheels cars released in 1968, the Hot Heap was a customized hot rod with Spectraflame paint.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/1932_Ford_hot_rod.jpg/320px-1932_Ford_hot_rod.jpg",
  },
  {
    id: BigInt(2),
    name: "Twin Mill",
    model: "Twin Mill",
    year: BigInt(1969),
    series: "Classic Collector Series",
    scale: "1:64",
    color: "Green",
    tampo: "Flame decals",
    description:
      "The iconic Twin Mill with its dual engines is one of the most recognized Hot Wheels designs ever created.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/1970_Ford_Mustang_Boss_302.jpg/320px-1970_Ford_Mustang_Boss_302.jpg",
  },
  {
    id: BigInt(3),
    name: "Deora",
    model: "Deora",
    year: BigInt(1967),
    series: "Original 16",
    scale: "1:64",
    color: "Blue",
    tampo: "",
    description:
      "Based on the Alexander Brothers' custom show car, the Deora featured a surfboard-carrying truck bed design.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(4),
    name: "Silhouette",
    model: "Silhouette",
    year: BigInt(1968),
    series: "Original 16",
    scale: "1:64",
    color: "Red",
    tampo: "",
    description:
      "A futuristic Mattel-designed car that was one of the Original 16 Hot Wheels released in 1968.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(5),
    name: "Beatnik Bandit",
    model: "Beatnik Bandit",
    year: BigInt(1968),
    series: "Original 16",
    scale: "1:64",
    color: "Orange",
    tampo: "",
    description:
      "Designed by Ed 'Big Daddy' Roth, the Beatnik Bandit was a bubble-top custom car among the Original 16.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(6),
    name: "'32 Ford Vicky",
    model: "Ford Victoria",
    year: BigInt(1972),
    series: "Flying Colors",
    scale: "1:64",
    color: "Yellow",
    tampo: "Flames",
    description:
      "A hot rod take on the 1932 Ford Victoria, popular in the Flying Colors era.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/1932_Ford_hot_rod.jpg/320px-1932_Ford_hot_rod.jpg",
  },
  {
    id: BigInt(7),
    name: "Street Rodder",
    model: "Street Rodder",
    year: BigInt(1976),
    series: "Flying Colors",
    scale: "1:64",
    color: "Red",
    tampo: "Stars & stripes",
    description:
      "A classic American street rod from the Flying Colors era with patriotic graphics.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/1970_Ford_Mustang_Boss_302.jpg/320px-1970_Ford_Mustang_Boss_302.jpg",
  },
  // --- 1980s ---
  {
    id: BigInt(8),
    name: "Rigor Motor",
    model: "Rigor Motor",
    year: BigInt(1994),
    series: "Go for the Gold",
    scale: "1:64",
    color: "Black",
    tampo: "Coffin graphics",
    description:
      "A wild coffin-shaped dragster themed around the macabre, from the 1990s mainline.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(9),
    name: "'57 Chevy",
    model: "Chevy Bel Air",
    year: BigInt(1977),
    series: "Hot Birds",
    scale: "1:64",
    color: "Red",
    tampo: "Gold stripes",
    description:
      "The iconic 1957 Chevrolet Bel Air in diecast form — a perennial Hot Wheels favorite.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/1957_Chevrolet_Bel_Air_2-door_hardtop%2C_red_%28photo_by_Greg_Gjerdingen%29.jpg/320px-1957_Chevrolet_Bel_Air_2-door_hardtop%2C_red_%28photo_by_Greg_Gjerdingen%29.jpg",
  },
  {
    id: BigInt(10),
    name: "Turboa",
    model: "Turboa",
    year: BigInt(1985),
    series: "Malaysia Series",
    scale: "1:64",
    color: "Silver",
    tampo: "Turbo lettering",
    description:
      "A futuristic turbocharged concept car from the mid-1980s Hot Wheels lineup.",
    countryOfOrigin: "Malaysia",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(11),
    name: "Ferrari Testarossa",
    model: "Testarossa",
    year: BigInt(1987),
    series: "Ferrari Series",
    scale: "1:64",
    color: "Red",
    tampo: "Ferrari horse",
    description:
      "The iconic wedge-shaped Ferrari Testarossa captured in 1:64 scale with Spectraflame red finish.",
    countryOfOrigin: "Italy",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ferrari_Testarossa_%281984%29.jpg/320px-Ferrari_Testarossa_%281984%29.jpg",
  },
  {
    id: BigInt(12),
    name: "Lamborghini Countach",
    model: "Countach",
    year: BigInt(1989),
    series: "Ultra Hots",
    scale: "1:64",
    color: "Yellow",
    tampo: "",
    description:
      "The wild scissor-door Lamborghini Countach in screaming yellow.",
    countryOfOrigin: "Italy",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Countach_LP500S.jpg/320px-Countach_LP500S.jpg",
  },
  // --- 1990s ---
  {
    id: BigInt(13),
    name: "Bone Shaker",
    model: "Bone Shaker",
    year: BigInt(2006),
    series: "New Models",
    scale: "1:64",
    color: "Black",
    tampo: "Skull and flames",
    description:
      "A hot rod with a skull-and-crossbones front grille and massive rear tires.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/1932_Ford_hot_rod.jpg/320px-1932_Ford_hot_rod.jpg",
  },
  {
    id: BigInt(14),
    name: "'93 Camaro",
    model: "Camaro",
    year: BigInt(1993),
    series: "Model Series",
    scale: "1:64",
    color: "Black",
    tampo: "Z28 graphics",
    description:
      "The fourth-generation Camaro Z28 in classic black — a 1990s muscle icon.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/1993_Chevrolet_Camaro_Z28.jpg/320px-1993_Chevrolet_Camaro_Z28.jpg",
  },
  {
    id: BigInt(15),
    name: "Speed Machine",
    model: "Speed Machine",
    year: BigInt(1991),
    series: "HW Mainline",
    scale: "1:64",
    color: "Blue",
    tampo: "Speed graphics",
    description:
      "A futuristic concept race car from the 1991 Hot Wheels mainline.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(16),
    name: "Ford GT90",
    model: "Ford GT90",
    year: BigInt(1996),
    series: "HW Mainline",
    scale: "1:64",
    color: "Silver",
    tampo: "GT90 decals",
    description:
      "Ford's concept supercar from 1995 with a quad-turbocharged V12, captured in die-cast.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(17),
    name: "McLaren F1",
    model: "McLaren F1",
    year: BigInt(1998),
    series: "HW Exotics",
    scale: "1:64",
    color: "Silver",
    tampo: "McLaren logo",
    description:
      "The legendary McLaren F1 road car — the fastest production car of its era.",
    countryOfOrigin: "UK",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/McLaren_F1_-_Goodwood_Festival_of_Speed_%28arp%29.jpg/320px-McLaren_F1_-_Goodwood_Festival_of_Speed_%28arp%29.jpg",
  },
  // --- 2000s ---
  {
    id: BigInt(18),
    name: "Deora II",
    model: "Deora II",
    year: BigInt(2000),
    series: "First Editions",
    scale: "1:64",
    color: "Blue",
    tampo: "Tribal surf graphics",
    description:
      "A futuristic surfboard-carrying concept car inspired by the original 1967 Deora.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(19),
    name: "Ferrari 360 Modena",
    model: "Ferrari 360",
    year: BigInt(2001),
    series: "Ferrari Series",
    scale: "1:64",
    color: "Red",
    tampo: "Ferrari horse",
    description: "The mid-engined Ferrari 360 Modena in classic rosso red.",
    countryOfOrigin: "Italy",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Ferrari_360_Modena_fl.jpg/320px-Ferrari_360_Modena_fl.jpg",
  },
  {
    id: BigInt(20),
    name: "Dodge Viper GTS-R",
    model: "Viper GTS-R",
    year: BigInt(2003),
    series: "HW Racing",
    scale: "1:64",
    color: "Blue",
    tampo: "Viper racing stripes",
    description:
      "The race-ready Dodge Viper GTS-R with its twin white racing stripes.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Dodge_viper_GTS_-_Flickr_-_Alexandre_Pr%C3%A9vot_%281%29.jpg/320px-Dodge_viper_GTS_-_Flickr_-_Alexandre_Pr%C3%A9vot_%281%29.jpg",
  },
  {
    id: BigInt(21),
    name: "'67 Camaro",
    model: "Camaro",
    year: BigInt(2005),
    series: "Muscle Mania",
    scale: "1:64",
    color: "Red",
    tampo: "Racing stripes",
    description:
      "The legendary first-generation Camaro in Hot Wheels form. A true muscle car icon.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/67camaro.jpg/320px-67camaro.jpg",
  },
  {
    id: BigInt(22),
    name: "'69 Dodge Charger",
    model: "Charger",
    year: BigInt(2007),
    series: "Mopar Madness",
    scale: "1:64",
    color: "Orange",
    tampo: "Mopar lettering",
    description:
      "The iconic General Lee-styled Dodge Charger in blazing orange.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/1969_dodge_charger_r_t.jpg/320px-1969_dodge_charger_r_t.jpg",
  },
  {
    id: BigInt(23),
    name: "Dodge Challenger Concept",
    model: "Challenger Concept",
    year: BigInt(2009),
    series: "HW Muscle",
    scale: "1:64",
    color: "Purple",
    tampo: "Rallye stripes",
    description:
      "The modern Dodge Challenger concept car evoking the spirit of the classic 1970s muscle car.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2008-Dodge-Challenger.jpg/320px-2008-Dodge-Challenger.jpg",
  },
  // --- 2010s ---
  {
    id: BigInt(24),
    name: "Lamborghini Huracán",
    model: "Huracán",
    year: BigInt(2015),
    series: "HW Exotics",
    scale: "1:64",
    color: "Yellow",
    tampo: "Carbon fiber accents",
    description:
      "The rear-wheel-drive Huracán LP 620-2 Super Trofeo in iconic yellow.",
    countryOfOrigin: "Italy",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/2015_Lamborghini_Huracan_LP_610-4_%2815642853985%29.jpg/320px-2015_Lamborghini_Huracan_LP_610-4_%2815642853985%29.jpg",
  },
  {
    id: BigInt(25),
    name: "Ferrari 488 GTB",
    model: "Ferrari 488 GTB",
    year: BigInt(2016),
    series: "HW Exotics",
    scale: "1:64",
    color: "Red",
    tampo: "Ferrari prancing horse",
    description:
      "The mid-engine Italian supercar with twin-turbocharged V8 engine.",
    countryOfOrigin: "Italy",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ferrari_488_GTB_-_Flickr_-_Alexandre_Pr%C3%A9vot.jpg/320px-Ferrari_488_GTB_-_Flickr_-_Alexandre_Pr%C3%A9vot.jpg",
  },
  {
    id: BigInt(26),
    name: "Audi R8 Spyder",
    model: "Audi R8",
    year: BigInt(2017),
    series: "HW Exotics",
    scale: "1:64",
    color: "Blue",
    tampo: "Audi quattro rings",
    description:
      "The German supercar convertible with a naturally-aspirated V10 engine.",
    countryOfOrigin: "Germany",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2016_Audi_R8_V10_Plus_in_Suzuka_Grey%2C_front_8.28.17.jpg/320px-2016_Audi_R8_V10_Plus_in_Suzuka_Grey%2C_front_8.28.17.jpg",
  },
  {
    id: BigInt(27),
    name: "Bugatti Chiron",
    model: "Bugatti Chiron",
    year: BigInt(2018),
    series: "HW Exotics",
    scale: "1:64",
    color: "Blue",
    tampo: "Bugatti EB lettering",
    description:
      "The 1,500hp French hypercar that succeeded the legendary Veyron.",
    countryOfOrigin: "France",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Bugatti_Chiron_-_Goodwood_Festival_of_Speed_2018_-_Goodwood_%281%29.jpg/320px-Bugatti_Chiron_-_Goodwood_Festival_of_Speed_2018_-_Goodwood_%281%29.jpg",
  },
  {
    id: BigInt(28),
    name: "'69 Dodge Charger Daytona",
    model: "Charger Daytona",
    year: BigInt(2019),
    series: "Mopar Madness",
    scale: "1:64",
    color: "Orange",
    tampo: "Mopar lettering",
    description:
      "The winged wonder of NASCAR, now in diecast form with iconic orange finish.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/1969_dodge_charger_r_t.jpg/320px-1969_dodge_charger_r_t.jpg",
  },
  {
    id: BigInt(29),
    name: "Nissan Skyline GT-R (R34)",
    model: "Skyline GT-R",
    year: BigInt(2020),
    series: "JDM Legends",
    scale: "1:64",
    color: "Silver",
    tampo: "Nismo racing stripes",
    description:
      "The legendary Godzilla from Japan — one of the most sought-after JDM cars ever made.",
    countryOfOrigin: "Japan",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Nissan_Skyline_GT-R_R34_001.jpg/320px-Nissan_Skyline_GT-R_R34_001.jpg",
  },
  {
    id: BigInt(30),
    name: "'71 Dodge Challenger",
    model: "Challenger",
    year: BigInt(2021),
    series: "Muscle Mania",
    scale: "1:64",
    color: "Purple",
    tampo: "Rallye stripes",
    description:
      "The classic pony car with its wide body and legendary Hemi engine.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2008-Dodge-Challenger.jpg/320px-2008-Dodge-Challenger.jpg",
  },
  {
    id: BigInt(31),
    name: "Ford Mustang Boss 429",
    model: "Mustang",
    year: BigInt(2022),
    series: "Muscle Mania",
    scale: "1:64",
    color: "Black",
    tampo: "Boss 429 side stripes",
    description:
      "The ultimate muscle Mustang with its 429 cubic inch V8 engine.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/1969_Ford_Mustang_Boss_429_%28orange%29_%28I%29.jpg/320px-1969_Ford_Mustang_Boss_429_%28orange%29_%28I%29.jpg",
  },
  {
    id: BigInt(32),
    name: "Toyota Supra MK4",
    model: "Supra",
    year: BigInt(2023),
    series: "JDM Legends",
    scale: "1:64",
    color: "White",
    tampo: "Turbo wing decals",
    description:
      "The iconic Supra with its twin-turbocharged 2JZ engine and massive rear wing.",
    countryOfOrigin: "Japan",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Toyota_Supra_A80_silver.jpg/320px-Toyota_Supra_A80_silver.jpg",
  },
  {
    id: BigInt(33),
    name: "Porsche 911 GT3 RS",
    model: "Porsche 911",
    year: BigInt(2016),
    series: "HW Porsche",
    scale: "1:64",
    color: "White",
    tampo: "GT3 RS decals",
    description:
      "The legendary Porsche 911 GT3 RS in track-ready white with racing livery.",
    countryOfOrigin: "Germany",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2016_Porsche_911_GT3_RS_%28991%29%2C_front_8.7.17.jpg/320px-2016_Porsche_911_GT3_RS_%28991%29%2C_front_8.7.17.jpg",
  },
  {
    id: BigInt(34),
    name: "McLaren Senna",
    model: "McLaren Senna",
    year: BigInt(2019),
    series: "HW Exotics",
    scale: "1:64",
    color: "Papaya Orange",
    tampo: "McLaren livery",
    description:
      "Named after the legendary F1 driver, the Senna is McLaren's ultimate track car.",
    countryOfOrigin: "UK",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/McLaren_Senna_at_2018_Geneva_Motor_Show.jpg/320px-McLaren_Senna_at_2018_Geneva_Motor_Show.jpg",
  },
  {
    id: BigInt(35),
    name: "Pagani Huayra",
    model: "Pagani Huayra",
    year: BigInt(2014),
    series: "HW Exotics",
    scale: "1:64",
    color: "Silver",
    tampo: "Pagani logo",
    description:
      "The Italian masterpiece from Pagani, a hand-built hypercar in silver.",
    countryOfOrigin: "Italy",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Pagani_Huayra_%402012_Paris_Motor_Show.jpg/320px-Pagani_Huayra_%402012_Paris_Motor_Show.jpg",
  },
  {
    id: BigInt(36),
    name: "Koenigsegg Agera R",
    model: "Agera R",
    year: BigInt(2013),
    series: "HW Exotics",
    scale: "1:64",
    color: "Black",
    tampo: "Swedish flag",
    description:
      "The Swedish hypercar record breaker — one of the fastest road cars ever built.",
    countryOfOrigin: "Sweden",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Koenigsegg_Agera_R_-_Goodwood_Festival_of_Speed_2012_%287644001504%29.jpg/320px-Koenigsegg_Agera_R_-_Goodwood_Festival_of_Speed_2012_%287644001504%29.jpg",
  },
  {
    id: BigInt(37),
    name: "Hennessey Venom GT",
    model: "Venom GT",
    year: BigInt(2012),
    series: "HW Exotics",
    scale: "1:64",
    color: "Black",
    tampo: "Venom graphics",
    description:
      "The Texas-built twin-turbo monster that once held the top speed record.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(38),
    name: "'10 Pro Stock Camaro",
    model: "Camaro",
    year: BigInt(2010),
    series: "HW Racing",
    scale: "1:64",
    color: "Black",
    tampo: "Racing livery",
    description:
      "The fifth-generation Camaro in NHRA Pro Stock drag racing trim.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/1970_Ford_Mustang_Boss_302.jpg/320px-1970_Ford_Mustang_Boss_302.jpg",
  },
  {
    id: BigInt(39),
    name: "'11 Dodge Challenger Drag Pak",
    model: "Challenger Drag Pak",
    year: BigInt(2011),
    series: "HW Racing",
    scale: "1:64",
    color: "Red",
    tampo: "Mopar drag pak graphics",
    description:
      "The Mopar Challenger Drag Pak built specifically for NHRA Stock Eliminator racing.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2008-Dodge-Challenger.jpg/320px-2008-Dodge-Challenger.jpg",
  },
  // --- 2024+ ---
  {
    id: BigInt(40),
    name: "Deora III",
    model: "Deora III",
    year: BigInt(2024),
    series: "HW Art Cars",
    scale: "1:64",
    color: "Orange",
    tampo: "Tribal wave graphics",
    description:
      "The third-generation Deora continues the surfboard-hauling legacy with a futuristic electric truck design.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(41),
    name: "Rivian R1T",
    model: "Rivian R1T",
    year: BigInt(2024),
    series: "Green Speed",
    scale: "1:64",
    color: "Green",
    tampo: "Rivian logo",
    description:
      "The all-electric adventure truck from Rivian, joining Hot Wheels' growing EV lineup.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
  {
    id: BigInt(42),
    name: "'24 Chevy Silverado EV",
    model: "Silverado EV",
    year: BigInt(2024),
    series: "Green Speed",
    scale: "1:64",
    color: "Silver",
    tampo: "EV badge",
    description:
      "The all-electric version of Chevy's iconic Silverado pickup, in diecast form.",
    countryOfOrigin: "USA",
    createdAt: BigInt(0),
    imageUrl: "",
  },
];

// Build year filter options: all Hot Wheels years, with cars having data highlighted
function getSeedYears(): Set<string> {
  return new Set(SEED_CARS.map((c) => String(Number(c.year))));
}

export default function CatalogApp() {
  const { clear, identity } = useInternetIdentity();
  const [backend, setBackend] = useState<HWBackend | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const [cars, setCars] = useState<HotWheelsCar[]>(SEED_CARS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState<HotWheelsCar | null>(null);
  const [favorites, setFavorites] = useState<Set<bigint>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [backendYears, setBackendYears] = useState<string[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // All possible filter options: full HW history
  const allYears = allHWYears();
  const seedYears = getSeedYears();

  // Filter options: "All" + full year range
  const filterOptions = ["All", ...allYears];

  // Initialize backend
  useEffect(() => {
    const init = async () => {
      try {
        const options = identity ? { agentOptions: { identity } } : undefined;
        const rawActor = await createActorWithConfig(options);
        const actor = rawActor as unknown as HWBackend;
        setBackend(actor);

        const [adminStatus, allCarsFromBackend, years] = await Promise.all([
          actor.isCallerAdmin().catch(() => false),
          actor.listCars().catch(() => [] as HotWheelsCar[]),
          actor.getDistinctYears().catch(() => [] as bigint[]),
        ]);

        setIsAdmin(adminStatus);

        if (allCarsFromBackend.length > 0) {
          setCars(allCarsFromBackend);
        }
        if (years.length > 0) {
          setBackendYears(years.map((y) => String(Number(y))));
        }
      } catch (e) {
        console.error("Backend init error:", e);
      }
    };
    init();
  }, [identity]);

  const applyClientFilter = useCallback((query: string, filter: string) => {
    const q = query.trim().toLowerCase();
    let filtered = SEED_CARS;
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.series.toLowerCase().includes(q),
      );
    }
    if (filter !== "All") {
      filtered = filtered.filter((c) => String(Number(c.year)) === filter);
    }
    setCars(filtered);
  }, []);

  const fetchCars = useCallback(
    async (query: string, filter: string) => {
      if (!backend) return;
      setLoading(true);
      try {
        let result: HotWheelsCar[];
        if (query.trim()) {
          result = await backend.searchCars(query.trim());
        } else if (filter !== "All") {
          result = await backend.getCarsByYear(BigInt(filter));
        } else {
          result = await backend.listCars();
        }
        if (result.length > 0) {
          setCars(result);
        } else {
          applyClientFilter(query, filter);
        }
      } catch (e) {
        console.error("Fetch error:", e);
        applyClientFilter(query, filter);
      } finally {
        setLoading(false);
      }
    },
    [backend, applyClientFilter],
  );

  const handleFilterChange = useCallback(
    (filter: string) => {
      setSelectedFilter(filter);
      if (!backend) {
        applyClientFilter(searchQuery, filter);
      }
    },
    [backend, searchQuery, applyClientFilter],
  );

  // Debounced search with backend
  useEffect(() => {
    if (!backend) return;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchCars(searchQuery, selectedFilter);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, selectedFilter, fetchCars, backend]);

  // Client-side search when no backend
  useEffect(() => {
    if (backend) return;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      applyClientFilter(searchQuery, selectedFilter);
    }, 150);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, selectedFilter, backend, applyClientFilter]);

  const toggleFavorite = useCallback((id: bigint) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const favoritedCars = cars.filter((c) => favorites.has(c.id));
  const displayedCars = activeTab === "catalog" ? cars : favoritedCars;

  const handleLogout = () => {
    clear();
    toast.success("Signed out successfully");
  };

  const navTabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "catalog", label: "Catalog", icon: <Grid3X3 size={20} /> },
    { id: "favorites", label: "Favorites", icon: <Heart size={20} /> },
    { id: "admin", label: "Admin", icon: <Settings size={20} /> },
  ];

  // Active filter years: combine backend years + seed years for highlighting
  const activeYears = new Set([...Array.from(seedYears), ...backendYears]);

  return (
    <div
      className="min-h-screen flex flex-col pb-20 md:pb-0"
      style={{
        background:
          "radial-gradient(ellipse at center, #2A0B0E 0%, #0B0C10 70%)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(11,12,16,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,59,48,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <Flame className="text-hw-accent" size={20} />
          <span
            className="text-lg font-display font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #FF3B30, #FF5A1F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            HOT WHEELS
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-hw-muted hover:text-hw-text gap-1.5"
          data-ocid="catalog.logout.button"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline text-xs">Sign Out</span>
        </Button>
      </header>

      {/* Tab Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "catalog" || activeTab === "favorites" ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pt-4"
            >
              {activeTab === "catalog" && (
                <>
                  {/* Search bar */}
                  <div
                    className="relative mb-4"
                    data-ocid="catalog.search_input"
                  >
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-hw-muted"
                    />
                    <Input
                      placeholder="Search by name, model, series…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-9 h-11 font-body"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,59,48,0.2)",
                        color: "#F2F2F2",
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-hw-muted hover:text-hw-text"
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Filter chips — full HW year range */}
                  <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
                    {filterOptions.map((opt) => {
                      const hasData = opt === "All" || activeYears.has(opt);
                      const isSelected = selectedFilter === opt;
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleFilterChange(opt)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold font-body transition-all"
                          style={{
                            background: isSelected
                              ? "linear-gradient(135deg, #FF3B30, #FF5A1F)"
                              : hasData
                                ? "rgba(255,59,48,0.15)"
                                : "rgba(255,255,255,0.05)",
                            color: isSelected
                              ? "white"
                              : hasData
                                ? "#FF7A6E"
                                : "#666",
                            border: isSelected
                              ? "1px solid transparent"
                              : hasData
                                ? "1px solid rgba(255,59,48,0.35)"
                                : "1px solid rgba(255,255,255,0.08)",
                          }}
                          data-ocid="catalog.filter.tab"
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Car grid */}
              {loading ? (
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  data-ocid="catalog.loading_state"
                >
                  {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
                    <Skeleton
                      key={sk}
                      className="h-48 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  ))}
                </div>
              ) : displayedCars.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 gap-3"
                  data-ocid="catalog.empty_state"
                >
                  <span className="text-5xl">
                    {activeTab === "favorites" ? "💔" : "🔍"}
                  </span>
                  <p className="text-hw-muted text-sm text-center font-body">
                    {activeTab === "favorites"
                      ? "No favorites yet. Tap ♥ on any car to save it."
                      : "No cars found for this year yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {displayedCars.map((car, idx) => (
                    <CarCard
                      key={String(car.id)}
                      car={car}
                      isFavorite={favorites.has(car.id)}
                      onToggleFavorite={toggleFavorite}
                      onClick={() => setSelectedCar(car)}
                      index={idx + 1}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPanel
                backend={backend}
                isAdmin={isAdmin}
                cars={cars}
                onCarsUpdate={setCars}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(17,18,23,0.97)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,59,48,0.15)",
        }}
      >
        <div className="flex">
          {navTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative"
              style={{
                color: activeTab === tab.id ? "#FF3B30" : "#B6B6B6",
              }}
              data-ocid={`nav.${tab.id}.tab`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background: "linear-gradient(90deg, #FF3B30, #FF5A1F)",
                  }}
                />
              )}
              {tab.icon}
              <span className="text-xs font-body font-semibold">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Nav */}
      <nav
        className="hidden md:flex fixed top-0 right-0 items-center gap-1 px-4 py-3 z-50"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="flex gap-1 rounded-full px-2 py-1"
          style={{
            pointerEvents: "all",
            background: "rgba(17,18,23,0.9)",
            border: "1px solid rgba(255,59,48,0.2)",
          }}
        >
          {navTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, #FF3B30, #FF5A1F)"
                    : "transparent",
                color: activeTab === tab.id ? "white" : "#B6B6B6",
              }}
              data-ocid={`desktop-nav.${tab.id}.tab`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Car detail modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          isFavorite={favorites.has(selectedCar.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
}
