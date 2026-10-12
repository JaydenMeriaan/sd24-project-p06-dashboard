"use client";


import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Accordion, AccordionSummary, AccordionDetails,Stack,} from "@mui/material";



export default function Support() {
  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">

      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-[144.5rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[288.75rem]"
        />
      </div>

  
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          FAQ
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Veel gestelde vragen over de Sustainable Development Goals
        </p>
      </div>

    
      <FrequentlyAskedQuestions />
    </div>
  );
}

const faqItems = [
  {
    question: "Wat zijn de SDG’s?",
    answer:
      "De SDG’s zijn 17 doelen van de Verenigde Naties om de wereld eerlijker, veiliger en gezonder te maken.",
  },
  {
    question: "Waarom bestaan de SDG’s?",
    answer:
      "Ze helpen om grote problemen zoals armoede, slecht onderwijs en klimaatverandering aan te pakken.",
  },
  {
    question: "Voor wie zijn de SDG’s belangrijk?",
    answer: "Voor iedereen: landen, bedrijven, scholen én gewone mensen.",
  },
  {
    question: "Wat willen de SDG’s bereiken?",
    answer:
      "Een duurzame toekomst waarin iedereen kansen heeft en de planeet wordt beschermd.",
  },
  {
    question: "Wanneer moeten de SDG’s gehaald worden?",
    answer: "Het doel is om ze in 2030 te behalen.",
  },
  {
    question: "Wat betekent SDG’s monitoren en evalueren?",
    answer:
      "Kijken hoe ver we zijn en controleren wat goed gaat en wat beter kan.",
  },
  {
    question: "Waarom is het meten van SDG’s belangrijk?",
    answer: "Zo weten we op tijd of we moeten bijsturen om de doelen te halen.",
  },
  {
    question: "Hoe worden de SDG’s gemeten?",
    answer:
      "Met cijfers en rapporten over onderwerpen zoals armoede, gezondheid en klimaat.",
  },
  {
    question: "Wat kan een organisatie doen om bij te dragen?",
    answer:
      "Duurzaam werken, minder afval, eerlijk inkopen en projecten steunen die bij een SDG passen.",
  },
  {
    question: "Wat kan ik zelf doen?",
    answer:
      "Energie besparen, recyclen, anderen helpen en bewust kiezen wat je koopt.",
  },
];

const FrequentlyAskedQuestions = () => {
  return (
    <Stack spacing={2} className="max-w-2xl mx-auto">
      {faqItems.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            {item.question}
          </AccordionSummary>
          <AccordionDetails id={`panel${index}-content`}>
            {item.answer}
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
};
