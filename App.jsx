import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   SALSA SOLENT DANCE ACADEMY — Members curriculum portal

   ⚠ ACCESS CONTROL: the sign-in below is a FRONT-END GATE ONLY.
   It is not security. Anyone can read this file in the browser.
   Before launch, replace it with real server-side auth and put
   the videos behind private hosting. See notes in chat.
   ============================================================ */

/* ============================================================
   BRAND TOKENS — read from salsasolent.com
   ------------------------------------------------------------
   Navy chrome, white content, orange accents. Headings are
   UPPERCASE with wide letter-spacing. Everything in this file
   derives from the values below — change them here only.

   Hexes are sampled from a screenshot, so they may be a shade
   out. If you want them exact, Divi > Theme Options > General
   has the real values.
   ============================================================ */
const BRAND = {
  navy:      "#0F4E8C", // header bar, hero, footer
  navyDeep:  "#0B3A69", // hover states, footer base
  orange:    "#F0911E", // buttons, headings, accents
  orangeDeep:"#D97D10", // button hover
  text:      "#1C4A78", // body copy (navy-tinted, as on the main site)
  surface:   "#F3F7FB", // panels and cards
  white:     "#FFFFFF",
  font: "'Montserrat'", // main site heading + body face
  tagline: "energy, passion, community",
  established: 2019,        // from the main site's "2019 / ESTABLISHED" stat
  copyrightYear: null,      // leave null to track the current year; set a number to pin it

  // The script logo, embedded as a CSS mask so it can be tinted to any
  // brand colour from a single asset (white in the navy bar, navy on white).
  // LOGO_MASK is defined at the foot of this file.
  logo: true,
  company: {
    name: "SALSA SOLENT LIMITED",
    number: "15662890",
    address: "8 Spur Road, Cosham, Portsmouth, England, PO6 3EB",
  },
  links: {
    account: "https://salsasolent.com/my-account/",
    membership: "https://salsasolent.com/membership/",
    schedule: "https://salsasolent.com/schedule/",
    book: "https://salsasolent.com/in-person",
    contact: "https://salsasolent.com/contact-us/",
    terms: "https://salsasolent.com/terms-and-conditions/",
    privacy: "https://salsasolent.com/privacy-policy/",
    facebook: "https://www.facebook.com/SalsaSolent",
    instagram: "https://www.instagram.com/salsasolent/",
    youtube: "https://www.youtube.com/channel/UCzAT3yRonzLN5jMOvDwmoAA",
  },
};

/* ---------- Rhythm grids: 16 semiquaver cells per two bars ---------- */
const CLAVES = {
  // 16 cells = 16 quavers = two bars of 4/4. `counts` maps a cell to how
  // the stroke is counted aloud in class. `barTwo` is the cell that opens bar 2.
  son32: {
    cells: 16, hits: [1, 4, 7, 11, 13], barTwo: 9, label: "Son clave 3–2",
    counts: { 1: "1", 4: "2&", 7: "4", 11: "2", 13: "3" },
  },
  son23: {
    cells: 16, hits: [3, 5, 9, 12, 15], barTwo: 9, label: "Son clave 2–3",
    counts: { 3: "2", 5: "3", 9: "1", 12: "2&", 15: "4" },
  },
  rumba32: {
    cells: 16, hits: [1, 4, 8, 11, 13], barTwo: 9, label: "Rumba clave 3–2",
    counts: { 1: "1", 4: "2&", 8: "4&", 11: "2", 13: "3" },
  },
  pulse8: {
    cells: 16, hits: [1, 3, 5, 7, 9, 11, 13, 15], barTwo: 9, label: "The eight count",
    counts: { 1: "1", 3: "2", 5: "3", 7: "4", 9: "5", 11: "6", 13: "7", 15: "8" },
  },
  bell68: {
    cells: 12, hits: [1, 3, 5, 6, 8, 10, 12], barTwo: 7, label: "6/8 bell",
    counts: { 1: "1", 3: "3", 5: "5", 6: "6", 8: "8", 10: "10", 12: "12" },
  },
};

/* ---------- Curriculum ---------- */
const CURRICULUM = [
  {
    id: "technique",
    name: "Dance Technique",
    spanish: "T\u00e9cnica",
    accent: "#0F4E8C",
    clave: "pulse8",
    tracks: [
      { id: "warmup", name: "Warm up", note: "Before you dance" },
      { id: "body", name: "Body movement", note: "How Cuban movement works" },
    ],
    blurb:
      "Before any figures. How to prepare your body for a class, and the isolations and weight work that make Cuban dancing look Cuban. Come back to this course for as long as you dance.",
    levels: [
      {
        id: "tec-w",
        track: "warmup",
        name: "Calentamiento",
        rank: "Every class",
        summary:
          "Ten minutes that decide how the rest of the class goes. Done in this order for a reason.",
        lessons: [
          {
            id: "tec-w-01",
            title: "Why we warm up",
            duration: "9 min",
            timing: "Before every class",
            summary:
              "A dance warm-up is not a gym warm-up. You are preparing ankles, hips and spine for fast weight changes and rotation, not loading a barbell — and the order you do things in matters more than how long you spend.",
            focus: [
              "Raise the temperature first, mobilise second, stretch last — in that order",
              "Static stretching before dancing makes you less stable, not more",
              "Ten minutes is plenty if it is the right ten minutes",
              "Arrive early enough to actually do it — starting cold at eight o'clock is where injuries come from",
            ],
            mistakes: [
              "Long static hamstring stretches before class",
              "Skipping the warm-up because the first exercise looks easy",
            ],
            drill:
              "Run the full sequence in this section before your next class, and notice how different the first fifteen minutes feel.",
            note: "If something hurts rather than aches, stop and speak to a physiotherapist or your GP. Nothing here is medical advice.",
          },
          {
            id: "tec-w-02",
            title: "Ankles and feet",
            duration: "12 min",
            timing: "5 minutes, every class",
            summary:
              "Casino is danced on the balls of the feet with constant small changes of direction. Ankles carry more load here than in almost any other social dance, and they are where most dancers get hurt.",
            focus: [
              "Ankle circles in both directions, slowly, before any weight goes on them",
              "Rise and lower through the full range — feet parallel, then turned out",
              "Short-foot work: build the arch without curling the toes",
              "Balance on one leg for thirty seconds, then try it with your eyes closed",
            ],
            mistakes: [
              "Bouncing into ankle stretches instead of moving slowly",
              "Rolling out through the outside edge of the foot on turns",
            ],
            drill:
              "Thirty seconds per side of single-leg balance with your eyes closed, every day for two weeks. It is dull and it works.",
          },
          {
            id: "tec-w-03",
            title: "Hips, knees and spine",
            duration: "13 min",
            timing: "5 minutes, every class",
            summary:
              "The three areas doing the most work in Cuban dance. Mobilising them is not stretching — you are moving them through their range, not holding them at the end of it.",
            focus: [
              "Standing hip circles, both directions, keeping the ribs still",
              "Knee tracking: the knee follows the second toe, every time",
              "Spinal waves and side bends — small before large",
              "Rotation through the upper back rather than the lower back",
            ],
            mistakes: [
              "Forcing rotation from the lumbar spine",
              "Letting the knee collapse inwards during hip circles",
            ],
            drill:
              "Two minutes of the sequence, then dance a basic straight afterwards and feel what has changed in the hips.",
          },
          {
            id: "tec-w-04",
            title: "Getting the heart rate up",
            duration: "10 min",
            timing: "3–5 minutes",
            summary:
              "Cold muscles do not respond quickly, and casino asks for quick responses from the first figure. This is the easy travelling section that comes before anything technical.",
            focus: [
              "Three to five minutes of easy travelling before any figure work",
              "Use the music — walk the count rather than jogging on the spot",
              "You should be able to talk, but only just",
              "Build gradually: the last minute is faster than the first",
            ],
            mistakes: [
              "Going straight into full-speed figures from cold",
              "Warming up so hard that you are tired before class begins",
            ],
            drill:
              "Walk the basic timing around the room for four minutes, adding arms only in the last minute.",
          },
          {
            id: "tec-w-05",
            title: "Cooling down and looking after yourself",
            duration: "11 min",
            timing: "After every class",
            summary:
              "The end of class is when stretching actually helps, because the muscles are warm. This is also where the unglamorous things live: shoes, water, and the habits that keep you dancing for years.",
            focus: [
              "Static stretches belong here, not at the start",
              "Calves, hip flexors and quads take the most load in casino",
              "Drink water — a two-hour social is a long time on your feet",
              "Shoes matter more than any stretch: suede soles and a supportive fit",
            ],
            mistakes: [
              "Leaving straight after the last track",
              "Stretching into pain rather than mild tension",
            ],
            drill:
              "Five minutes of stretching after every class for a month, then judge whether next-day stiffness has changed.",
          },
        ],
      },
      {
        id: "tec-b",
        track: "body",
        name: "Movimiento",
        rank: "Foundation",
        summary:
          "The mechanics underneath every figure in the library. Slow work, and the fastest way to stop looking like a beginner.",
        lessons: [
          {
            id: "tec-b-01",
            title: "Posture and alignment",
            duration: "14 min",
            timing: "Continuous",
            summary:
              "Where your weight sits changes everything downstream. Get this wrong and no amount of figure practice will fix the way your dancing looks or feels.",
            focus: [
              "Weight slightly forward over the balls of the feet, heels touching lightly",
              "Ribcage stacked over the pelvis rather than behind it",
              "Long neck, eyes up and out — you are dancing with other people",
              "Knees soft and unlocked at all times",
            ],
            mistakes: [
              "Sitting back into the heels, which kills your ability to travel",
              "Tucking the pelvis under, which locks the hips out of the dance",
            ],
            drill:
              "Two minutes in front of a mirror, correcting one thing at a time. Then close your eyes and see if you can hold it.",
          },
          {
            id: "tec-b-02",
            title: "Weight transfer",
            duration: "16 min",
            timing: "One transfer per count",
            summary:
              "Almost every problem in a beginner's dancing is a weight transfer problem. Not knowing the figure is rarely the issue — being on the wrong foot always is.",
            focus: [
              "A step is a complete transfer: all of the weight arrives",
              "Land through the ball of the foot, then let the heel lower",
              "The body arrives with the foot, not a beat after it",
              "Test it by lifting the free foot — if you cannot, the transfer was incomplete",
            ],
            mistakes: [
              "Half-transfers that leave you unable to move the next foot",
              "Stepping with the foot and dragging the body along behind",
            ],
            drill:
              "Step slowly side to side. On every single step, lift the free foot clear of the floor to prove the transfer finished.",
          },
          {
            id: "tec-b-03",
            title: "Knees and the Cuban pulse",
            duration: "15 min",
            timing: "On every count",
            summary:
              "The soft, continuous knee action that makes Cuban dancing look Cuban. Everything above the knees is a consequence of what happens here.",
            focus: [
              "The knee bends as weight arrives and straightens as weight leaves",
              "Small — this is a pulse, not a squat",
              "Knees track over the toes, never falling inwards",
              "Keep it running even when the feet are still",
            ],
            mistakes: [
              "Bouncing from the ankles instead of driving from the knees",
              "Bending both knees together, which turns the pulse into a bob",
            ],
            drill:
              "Two minutes marching on the spot with the movement coming only from the knees. Film it from the side.",
          },
          {
            id: "tec-b-04",
            title: "Hip motion",
            duration: "17 min",
            timing: "Continuous",
            summary:
              "The most misunderstood thing in Cuban dance. The hips are not pushed — they move because the legs do. Once you feel the mechanism you stop having to think about it.",
            focus: [
              "Straighten the standing leg and let the hip rise on that side",
              "Go slowly enough to feel cause and effect",
              "Nothing above the waist should be working",
              "Add speed only once the mechanism is right",
            ],
            mistakes: [
              "Pushing the hips deliberately, which locks the knees",
              "Adding hip motion before the weight transfer is clean",
            ],
            drill:
              "Shift side to side for two minutes with your hands resting on your hips, feeling the hip lift rather than making it happen.",
          },
          {
            id: "tec-b-05",
            title: "Ribcage isolations",
            duration: "15 min",
            timing: "Slow, then to the count",
            summary:
              "Moving the ribs independently of the pelvis. This is where the whole upper half of Cuban movement comes from, and it is pure practice — nobody finds it natural.",
            focus: [
              "Side to side first, with the pelvis completely still",
              "Then forward and back",
              "Then join them into a circle, in both directions",
              "Keep the shoulders out of it entirely",
            ],
            mistakes: [
              "Moving the whole torso and calling it an isolation",
              "Lifting one shoulder to fake the sideways movement",
            ],
            drill:
              "Two minutes of each direction with your hands on your shoulders, so the arms cannot help you cheat.",
          },
          {
            id: "tec-b-06",
            title: "Shoulders, arms and tone",
            duration: "14 min",
            timing: "Continuous",
            summary:
              "What the upper body does when it is not being led, and how much tension to carry in the arms. Tone is the thing partners feel first and beginners think about last.",
            focus: [
              "Shoulders down and back; any movement stays small",
              "Arms carry tone, not tension — you should still be breathing easily",
              "Elbows stay in front of the body line in partner hold",
              "Test it: someone moves your arm and it follows, neither resisting nor collapsing",
            ],
            mistakes: [
              "Gripping with the hands to make up for no tone in the arm",
              "Shoulders creeping up towards the ears whenever you concentrate",
            ],
            drill:
              "Have a partner move your arm slowly in every direction. Follow it without pushing back and without going limp.",
          },
        ],
      },
    ],
  },
  {
    id: "casino",
    name: "Salsa Cubana",
    spanish: "Casino",
    accent: "#F0911E",
    clave: "son32",
    tracks: [
      { id: "partner", name: "Partnerwork", note: "Danced with someone" },
      { id: "solo", name: "Solo", note: "Danced on your own" },
    ],
    blurb:
      "The social dance of Havana. Circular, springy, danced in open hold and built from a small set of figures you will use for the rest of your dancing life.",
    levels: [
      {
        id: "cas-b1",
        track: "partner",
        name: "Beginners L1",
        rank: "01",
        summary:
          "Your first six lessons. The seven steps, the frame, and the four figures everything else hangs off.",
        lessons: [
          {
            id: "cas-b1-01",
            title: "The seven basic steps",
            duration: "24 min",
            timing: "1-2-3 · 5-6-7",
            clips: [
              { id: "cas-b1-01-a", label: "B\u00e1sico", video: null },
              { id: "cas-b1-01-b", label: "Side to side", video: null },
              { id: "cas-b1-01-c", label: "Forward & back", video: null },
              { id: "cas-b1-01-d", label: "On the spot", video: null },
              { id: "cas-b1-01-e", label: "Open step", video: null },
              { id: "cas-b1-01-f", label: "Left & right turns", video: null },
              { id: "cas-b1-01-g", label: "Susie Q", video: null },
            ],
            summary:
              "Everything in casino is assembled from seven steps. Learn these properly and you can dance; learn them badly and every figure after this feels harder than it should. Nobody needs to move on until all seven happen without thinking.",
            focus: [
              "B\u00e1sico \u2014 the Cuban basic: back on 1, replace on 2-3, forward on 5, replace on 6-7",
              "Side to side \u2014 stepping out and closing, left then right, feet never crossing",
              "Forward and back \u2014 small travelling steps with the weight staying forward",
              "On the spot \u2014 marking the full count with no travel at all, for crowded floors",
              "Open step \u2014 opening out to the side and closing again; the shape behind most exits",
              "Left and right turns \u2014 a full turn inside the count, landing cleanly on the beat",
              "Susie Q \u2014 the crossing, twisting step that turns up in every shine",
            ],
            mistakes: [
              "Learning six of them and hoping the seventh will not come up",
              "Adding arms and styling before the feet run on their own",
            ],
            drill:
              "Two minutes on each step in order, to a slow track. Then have someone call them at random so you have to change on the next 1 without stopping. When all seven survive that, you are ready for a partner.",
          },
          {
            id: "cas-b1-02",
            title: "Partnerwork \u2014 the frame",
            duration: "20 min",
            timing: "1-2-3 · 5-6-7",
            clips: [
              { id: "cas-b1-02-a", label: "The frame", video: null },
              { id: "cas-b1-02-b", label: "Casino", video: null },
              { id: "cas-b1-02-c", label: "Guapea", video: null },
            ],
            summary:
              "Your first lesson in hold. How much tension to carry, where the hands sit, and the two basic partner steps: casino in closed position and guapea in open hold.",
            focus: [
              "The frame: contact through the arms and the body, never through grip",
              "Elastic tone \u2014 enough to feel each other, never enough to pull",
              "Casino \u2014 the closed-position basic, both partners moving as one weight",
              "Guapea \u2014 the open-hold basic: leader back on 1, forward on 5, follower mirrors",
              "Keep the step small; the energy goes down into the floor, not backwards across the room",
            ],
            mistakes: [
              "Locked elbows, so the follower gets yanked forward on 5",
              "Stepping back so far that the couple drifts apart and the connection goes slack",
            ],
            drill:
              "Eight bars of casino, eight of guapea, alternating, for a whole track. Then again with your eyes closed, keeping the distance between you constant.",
          },
          {
            id: "cas-b1-03",
            title: "Dile que s\u00ed \u2014 arm up and arm down",
            duration: "18 min",
            timing: "5-6-7 into 1-2-3",
            clips: [
              { id: "cas-b1-03-a", label: "Arm up", video: null },
              { id: "cas-b1-03-b", label: "Arm down", video: null },
            ],
            summary:
              "'Tell her yes.' The move that brings the follower from open hold into closed position. Two versions: taking her under a raised arm, or bringing her in with the arm low.",
            focus: [
              "Arm up: raise the joined hands and walk her through underneath into closed hold",
              "Arm down: keep the hands low and bring her round into the same place",
              "Step out of her path \u2014 the lead is you clearing the line, not you pulling her",
              "Finish square in closed position, on time, ready for whatever comes next",
            ],
            mistakes: [
              "Pulling her across instead of stepping aside",
              "Raising the arm so high that she has to duck under it",
            ],
            drill:
              "Alternate arm up and arm down every phrase for a whole track. She should be able to tell which is coming from your hand height alone.",
          },
          {
            id: "cas-1-04",
            title: "Enchufla",
            duration: "15 min",
            timing: "1-2-3 prepare · 5-6-7 travel",
            summary:
              "The plug-in. The couple swaps places while the follower turns to face back the way she came. Enchufla is the connective tissue of casino — most combinations are enchuflas with something added.",
            focus: [
              "Leader collects the follower's right hand on 1 and opens the gap on 2-3",
              "On 5-6-7 the follower walks forward through the space, then turns",
              "Leader travels too — this is an exchange, not the follower orbiting a stationary man",
              "Close with dile que no every single time while you are learning it",
            ],
            mistakes: [
              "Leading the turn before the follower has travelled, which spins her on the spot",
              "Raising the arm so high the follower has to duck",
            ],
            drill: "Enchufla, dile que no, guapea. Repeat sixteen times without stopping the music.",
          },
          {
            id: "cas-b1-05",
            title: "Aguajea",
            duration: "15 min",
            timing: "Two bars in, two bars out",
            summary:
              "A closed-position step where the couple rocks in and out together. It buys you a bar, it fits almost anywhere, and it is the first thing that makes two people look like one rather than two.",
            focus: [
              "Both partners move as a single unit \u2014 nobody is leading the feet here",
              "In on one bar, out on the next, staying square to each other",
              "Keep the frame steady while the weight travels",
              "Use it to reset when a figure has gone wrong",
            ],
            mistakes: [
              "One partner arriving before the other",
              "Losing the frame as the couple travels",
            ],
            drill:
              "One track using only casino, guapea and aguajea. Make it interesting anyway.",
            note: "Also called paseala or adentro y afuera in some schools.",
          },
          {
            id: "cas-b1-06",
            title: "Exh\u00edbela / Sacala",
            duration: "17 min",
            timing: "5-6-7",
            clips: [
              { id: "cas-b1-06-a", label: "Exh\u00edbela", video: null },
              { id: "cas-b1-06-b", label: "Sacala", video: null },
            ],
            summary:
              "Two ways of sending the follower out into the space: exh\u00edbela shows her off across the front, sacala takes her out and brings her back. Small moves, and a big lesson in frame and sight lines.",
            focus: [
              "Exh\u00edbela: the hand travels ahead of her, marking the path she will take",
              "Sacala: lead her out, let her travel, and collect her on the way back",
              "Turn your body to keep her in front of you rather than beside you",
              "Follower lengthens through the spine and takes full steps",
              "Resolve into dile que no, or straight into enchufla",
            ],
            mistakes: [
              "Arm held so high that the follower's shoulder lifts",
              "Leader standing still, which turns a display into a stumble",
            ],
            drill:
              "Exh\u00edbela, enchufla, dile que no. Then swap exh\u00edbela for sacala and notice how much more space you need.",
          },
        ],
      },
      {
        id: "cas-b2",
        track: "partner",
        name: "Beginners L2",
        rank: "02",
        summary:
          "Dile que no, then chaining figures together instead of resetting after each one.",
        lessons: [
          {
            id: "cas-1-03",
            title: "Dile que no",
            duration: "18 min",
            timing: "5-6-7 into 1-2-3",
            summary:
              "Literally 'tell him no'. The cross-body transition that closes nearly every figure in casino and returns the couple to guapea. If you only drill one thing, drill this.",
            focus: [
              "Leader opens the door with the left arm and steps out of the follower's path",
              "Follower walks a straight line forward — she does not turn early",
              "The turn happens on 6-7 as the leader pivots and gathers her in",
              "Finish square, in open hold, already on time for the next figure",
            ],
            mistakes: [
              "Follower turning on 5 rather than walking through the space",
              "Leader pulling the follower around him instead of clearing the line himself",
            ],
            drill:
              "Six consecutive dile que no with nothing in between. It should stop feeling like a move and start feeling like breathing.",
          },
          {
            id: "cas-1-05",
            title: "Enchufla doble",
            duration: "13 min",
            timing: "Two bars of travel",
            summary:
              "The same exchange, twice, without returning to guapea in between. This is where beginners first meet the idea that figures can be chained rather than reset.",
            focus: [
              "Keep the hand connection live through the join — do not regrip",
              "The second enchufla starts before the first has fully settled",
              "Follower keeps walking; her feet should never stop and restart",
              "Exit through dile que no on the second repetition",
            ],
            mistakes: [
              "A pause between the two halves, which kills the momentum",
              "Losing the count and arriving at dile que no on 1 instead of 5",
            ],
            drill: "Alternate: single enchufla, double enchufla, single, double — eight cycles.",
          },
          {
            id: "cas-b2-03",
            title: "Paseala",
            duration: "16 min",
            timing: "A full phrase",
            summary:
              "'Walk her.' The leader sends the follower on a walk and keeps his own basic going while she travels. The lesson is patience \u2014 she needs the whole phrase, and you have to give it to her.",
            focus: [
              "Lead the walk, then get out of the way",
              "Keep a steady basic so she has a rhythm to come back to",
              "She walks a real line, not a shuffle on the spot",
              "Collect her on the resolution, on 1, not a beat late",
            ],
            mistakes: [
              "Rushing her, so she arrives with nothing left to do",
              "Leader watching his own feet instead of his partner",
            ],
            drill:
              "Enchufla into paseala for a whole track. Follower adds one arm gesture on the walk \u2014 one, not four.",
          },
          {
            id: "cas-b2-04",
            title: "Enchufla con alarde",
            duration: "15 min",
            timing: "Two bars plus the flourish",
            summary:
              "An enchufla with a flourish on the exit. The figure underneath is one you already know; what is new is fitting decoration inside a phrase without losing the count.",
            focus: [
              "The enchufla itself does not change \u2014 resist the urge to make it bigger",
              "The alarde lands on the resolution, not in the middle of the travel",
              "Leader's footwork keeps running while the hands are busy",
              "Be able to drop the flourish and dance a plain enchufla at any point",
            ],
            mistakes: [
              "Stopping the feet to sort out the flourish",
              "Adding it before plain enchufla is genuinely automatic",
            ],
            drill:
              "Four plain enchuflas, four with the alarde, alternating, on the same track.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-b2-05",
            title: "Kentucky",
            duration: "16 min",
            timing: "Three to four bars",
            summary:
              "A wrap and release with a strong character. Danced here as a couple, before you meet it again as a rueda call. Get the size of the wrap right and it flows; get it wrong and you end up tangled.",
            focus: [
              "The wrap goes on as a hook rather than a grip, so she can slide out of it",
              "Unwind by turning, never by lifting the arms off",
              "Keep the basic running underneath the whole figure",
              "Exit into dile que no every time while you are learning it",
            ],
            mistakes: [
              "Gripping, so the follower cannot slide through",
              "Rushing the unwind and finishing a beat early",
            ],
            drill:
              "Walk the shape with no music four times, then add music at about seventy per cent speed.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-b2-06",
            title: "El uno / el dos",
            duration: "17 min",
            timing: "Three to five bars",
            summary:
              "Two figures that belong together. The second is the first with an extra pass added, so learn them side by side \u2014 telling them apart is most of the work.",
            focus: [
              "El uno: the single version \u2014 one pass, one resolution",
              "El dos: the same shape with a second pass before the exit",
              "Find the exact point where the two diverge and name it out loud",
              "Keep the follower's travel continuous through the join",
            ],
            mistakes: [
              "Learning them as two unrelated figures",
              "Pausing at the join, which kills the momentum",
            ],
            drill:
              "Leader silently chooses uno or dos. The follower should not be surprised by either.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
        ],
      },
      {
        id: "cas-i1",
        track: "partner",
        name: "Improvers L1",
        rank: "03",
        summary:
          "The classic figure families, and your first proper musicality lesson.",
        lessons: [
          {
            id: "cas-1-06",
            title: "Vacílala",
            duration: "12 min",
            timing: "5-6-7 release",
            summary:
              "'Enjoy her.' The leader releases and the follower turns and walks with her own styling while he keeps guapea. Your first taste of the space casino leaves for individual expression.",
            focus: [
              "Clean release — the hand leaves rather than being dropped",
              "Follower turns to her right and travels; she is not performing on the spot",
              "Leader keeps a steady basic so she has a rhythm to return to",
              "Re-establish the hold on the following 1, not a beat late",
            ],
            mistakes: [
              "Leader watching his own feet instead of the follower",
              "Follower rushing the turn and arriving with nothing left to do",
            ],
            drill:
              "Enchufla into vacílala. Follower adds one arm gesture on the walk — one, not four.",
          },
          {
            id: "cas-i1-02",
            title: "La prima / prima con la hermana",
            duration: "17 min",
            timing: "Back break, turn, release",
            summary:
              "Prima closes the couple, turns them together and releases. Danced as a couple here; the Rueda course covers the same figure used as a partner change in the wheel. Some schools teach it under the name adi\u00f3s.",
            focus: [
              "Back break, then gather her in close with her right arm raised",
              "Turn together as a couple \u2014 you are not turning her, you are turning with her",
              "Release on the resolution and open back out",
              "Con la hermana: turn out and enchufla instead of releasing straight away",
            ],
            mistakes: [
              "Turning the follower instead of turning with her",
              "Leaving before the turn has resolved, which pulls her off balance",
            ],
            drill:
              "Prima, dile que no, prima con la hermana, dile que no. Sixteen times without stopping the music.",
          },
          {
            id: "cas-2-01",
            title: "Sombrero",
            duration: "18 min",
            timing: "Two bars, wrap and unwind",
            summary:
              "'The hat'. Both arms travel over the heads and the couple ends momentarily wrapped, before unwinding into dile que no. The gateway to the whole setenta family.",
            focus: [
              "Get the hand heights right before you add travel — rehearse the shape at walking pace",
              "The wrap sits behind the neck, not on top of the head",
              "Unwind on 5-6-7 by turning, never by lifting the arms off",
              "Follower keeps her own axis; she is not being steered by the arms",
            ],
            mistakes: [
              "Trapping the follower's arm behind her because the wrap went too low",
              "Rushing the unwind and finishing a beat early",
            ],
            drill: "Walk the shape with no music, four times. Then add music at 70% speed.",
          },
          {
            id: "cas-2-02",
            title: "Setenta",
            duration: "22 min",
            timing: "Four bars",
            summary:
              "Seventy. The best known figure in casino: enchufla, hand behind the back, enchufla again, sombrero, exit. Learn it as four clear stations rather than one long sequence.",
            focus: [
              "Station 1 — enchufla, leader's left hand catches behind his own back",
              "Station 2 — second enchufla with the connection maintained behind",
              "Station 3 — the sombrero shape",
              "Station 4 — dile que no, on time, every time",
            ],
            mistakes: [
              "Gripping instead of hooking, so the follower cannot slide through",
              "Learning it as a memorised run and losing the ability to exit early when the floor is crowded",
            ],
            drill: "Practise stations 1–2 alone until they are automatic, then bolt on 3–4.",
          },
          {
            id: "cas-2-05",
            title: "Coca-Cola",
            duration: "15 min",
            timing: "Three to four bars",
            summary:
              "The leader travels behind the follower and comes round the other side, changing hands behind her back. Excellent for learning to move your own body rather than manoeuvre hers.",
            focus: [
              "Leader takes a real travelling path — this figure is about his journey",
              "The hand change behind the back happens without a squeeze",
              "Follower continues walking her line and does not turn to follow him",
              "Arrive facing, on 1, ready to resolve",
            ],
            mistakes: [
              "Leader cutting the corner, which drags the follower off balance",
              "Follower turning to watch, which unwinds the whole shape",
            ],
            drill: "Shadow the leader's path alone, marking the floor. Then add a partner.",
          },
          {
            id: "cas-3-06",
            title: "Hitting the breaks",
            duration: "17 min",
            timing: "Anticipating the bloque",
            summary:
              "Timba arrangements are full of ensemble hits. Landing on one with your partner is the single most satisfying thing in the dance, and it is mostly a listening skill.",
            focus: [
              "Learn the standard places breaks fall in the arrangements you dance to most",
              "Shorten or lengthen the figure you are in to arrive at the hit",
              "Signal early with a change of tone so the follower can commit",
              "Have one short reliable move you can drop onto any hit",
            ],
            mistakes: [
              "Hitting the break alone while your partner keeps dancing",
              "Learning tracks by memory rather than learning to hear structure",
            ],
            drill:
              "Pick one track. Dance it four times, aiming only to land the same two breaks each time.",
          },
        ],
      },
      {
        id: "cas-i2",
        track: "partner",
        name: "Improvers L2",
        rank: "04",
        summary:
          "Additions, travel, and the start of the setenta family.",
        lessons: [
          {
            id: "cas-i2-01",
            title: "Enchufla / vac\u00edlala con cero",
            duration: "18 min",
            timing: "Four to five bars",
            clips: [
              { id: "cas-i2-01-a", label: "Enchufla con cero", video: null },
              { id: "cas-i2-01-b", label: "Vac\u00edlala con cero", video: null },
            ],
            summary:
              "Cero adds a loop onto a figure you already have. Two different hosts, the same addition \u2014 learning both together makes the pattern obvious instead of giving you two things to memorise.",
            focus: [
              "Identify the host figure first, then the point where cero is inserted",
              "The addition costs bars: know how many before you start it",
              "The host figure is unchanged \u2014 do not inflate it to make room",
              "Be able to abandon the cero mid-figure and resolve normally",
            ],
            mistakes: [
              "Losing the count because the insertion was not budgeted for",
              "Learning it as two separate figures rather than one addition",
            ],
            drill:
              "Plain enchufla, enchufla con cero, plain vac\u00edlala, vac\u00edlala con cero. Repeat until the join disappears.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-i2-02",
            title: "Bayamo",
            duration: "17 min",
            timing: "Four to six bars",
            summary:
              "A travelling figure named after the city. It covers ground, so it needs space and a plan \u2014 on a busy floor you have to decide before you start it, not halfway through.",
            focus: [
              "Look at the floor before you commit; this one travels",
              "Leader's own path is the figure \u2014 he moves, she is not steered around him",
              "Keep the frame consistent while the couple relocates",
              "Arrive facing, on 1, ready to resolve",
            ],
            mistakes: [
              "Starting it in a gap that closes before you finish",
              "Dragging the follower along the leader's path instead of leading her onto her own",
            ],
            drill:
              "Shadow the leader's path alone with the floor marked out, then add a partner.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-i2-s1",
            title: "Setenta y uno / una",
            duration: "17 min",
            timing: "Four to six bars",
            summary:
              "The first of the setenta variations. Same entry, same family, one change \u2014 which is the whole point of learning the family in order rather than as a list of names.",
            focus: [
              "Dance plain setenta first and locate the exact station where this one diverges",
              "Uno and una are a pair: work out what separates them before drilling either",
              "Keep the leader's footwork running while the hands are busy",
              "Be able to bail back into plain setenta mid-figure when the floor closes up",
            ],
            mistakes: [
              "Learning it as a memorised run rather than as a variation on setenta",
              "Solving arm problems by stopping the feet",
            ],
            drill:
              "Plain setenta four times, then this variation four times, alternating. The entry should feel identical.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-i2-s2",
            title: "Setenta y dos / tres",
            duration: "18 min",
            timing: "Four to six bars",
            summary:
              "Two more from the same family, taken together. By now you should be able to predict roughly where a new setenta variation is going before you are shown it.",
            focus: [
              "Dance plain setenta first and locate the exact station where this one diverges",
              "Dos and tres share an entry; the difference lands late in the figure",
              "Keep the leader's footwork running while the hands are busy",
              "Be able to bail back into plain setenta mid-figure when the floor closes up",
            ],
            mistakes: [
              "Learning it as a memorised run rather than as a variation on setenta",
              "Solving arm problems by stopping the feet",
            ],
            drill:
              "Plain setenta four times, then this variation four times, alternating. The entry should feel identical.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-i2-03",
            title: "Musicality: hearing the clave and finding the 1",
            duration: "14 min",
            timing: "Son clave 3–2 and 2–3",
            summary:
              "Before any footwork, you need to hear where the music starts. This trains your ear on the five-stroke pattern that organises almost all Cuban music, and on finding beat 1 in a real recording rather than counting from silence. It is the one lesson that makes every later lesson easier, and the one most people skip.",
            focus: [
              "Clap 3–2 son clave slowly, then over a recording at speed",
              "Pick out the conga tumbao and the anticipated bass underneath the clave",
              "Count 1-2-3, 5-6-7 aloud while marking time on the spot",
              "Enter on 1 after listening for eight bars — no false starts",
              "Notice the moment you slip, rather than quietly correcting and carrying on",
            ],
            mistakes: [
              "Counting from the moment the track begins instead of from the musical 1",
              "Clapping rumba clave over a son track — the third stroke sits a semiquaver later",
            ],
            drill:
              "Fifteen minutes, three or four times this week. None of it needs a dance floor. Start by clapping the 3–2 clave on its own until it runs steadily without you thinking about it — count it out loud at first, then drop the counting and keep the hands going. Next, put on a slow son and clap along for a full minute without losing the pattern; if you drift, stop the track and start it again rather than scrambling to catch up, because catching up teaches you nothing. Then stop clapping and count 1-2-3, 5-6-7 aloud over the same track while marking time on the spot, so the count is attached to a weight change and not just to your voice. Finally, take three tracks you have never heard before. Listen to each for thirty seconds without counting at all, then come in on 1 and keep counting to the end of the track. Expect to be wrong. Hearing that you have slipped, and knowing roughly where, is the actual skill here — being right first time is not the target. Carry it into the rest of the week too: count along on the bus, in the car, while you are washing up. Ten minutes a day of that beats an hour at the weekend.",
          },
        ],
      },
      {
        id: "cas-int",
        track: "partner",
        name: "Intermediate",
        rank: "05",
        summary:
          "The rest of the setenta family, and listening properly to what the band is doing.",
        lessons: [
          {
            id: "cas-2-03",
            title: "Setenta complicado",
            duration: "17 min",
            timing: "Five to six bars",
            summary:
              "Setenta with an extra wrap inserted before the resolution. The point is not more moves — it is learning how a figure family extends.",
            focus: [
              "Identify exactly which station the addition slots into",
              "Keep the follower's travel continuous through the extra bar",
              "Leader's footwork must not stall while his hands are busy",
              "Be able to bail back to plain setenta mid-figure",
            ],
            mistakes: [
              "The leader stopping his basic to sort out the arms",
              "Adding the complication before plain setenta is reliable",
            ],
            drill: "Alternate plain and complicado on the same track, deciding at the last moment.",
          },
          {
            id: "cas-int-02",
            title: "Setenta y cinco",
            duration: "18 min",
            timing: "Four to six bars",
            summary:
              "A longer variation for dancers who already have setenta and setenta complicado in their hands.",
            focus: [
              "Dance plain setenta first and locate the exact station where this one diverges",
              "Longer figures need the exit planned before the entry, not discovered at the end",
              "Keep the leader's footwork running while the hands are busy",
              "Be able to bail back into plain setenta mid-figure when the floor closes up",
            ],
            mistakes: [
              "Learning it as a memorised run rather than as a variation on setenta",
              "Solving arm problems by stopping the feet",
            ],
            drill:
              "Plain setenta four times, then this variation four times, alternating. The entry should feel identical.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-int-03",
            title: "Setenta abajo",
            duration: "18 min",
            timing: "Four to six bars",
            summary:
              "The low version. Same family, taken down \u2014 which changes the leader's footwork more than it changes the arms.",
            focus: [
              "Dance plain setenta first and locate the exact station where this one diverges",
              "Going low is a knee action, not a bend at the waist",
              "Keep the leader's footwork running while the hands are busy",
              "Be able to bail back into plain setenta mid-figure when the floor closes up",
            ],
            mistakes: [
              "Learning it as a memorised run rather than as a variation on setenta",
              "Solving arm problems by stopping the feet",
            ],
            drill:
              "Plain setenta four times, then this variation four times, alternating. The entry should feel identical.",
            note: "Step breakdown to be confirmed against how we teach it. What is written here covers the family mechanics rather than the exact sequence \u2014 correct it before recording.",
          },
          {
            id: "cas-2-04",
            title: "Ochenta",
            duration: "16 min",
            timing: "Four bars",
            summary:
              "Eighty. Sister figure to setenta, with the wrap taken in front rather than behind. Learning both back to back teaches you to read the shape rather than memorise the name.",
            focus: [
              "Compare directly with setenta — note the single point where they diverge",
              "Front wrap needs more space; step out slightly on the preparation",
              "Follower reads the height of the hand to know which is coming",
              "Same exit as setenta, so the endings become interchangeable",
            ],
            mistakes: [
              "Crowding the follower because the front wrap was taken too close",
              "Announcing the figure by name in social dancing — she should feel it, not be told",
            ],
            drill: "Leader silently chooses setenta or ochenta. Follower should not be surprised.",
          },
          {
            id: "cas-2-07",
            title: "Musicality: son montuno and timba",
            duration: "19 min",
            timing: "Phrase-level listening",
            summary:
              "Cuban tracks are not uniform. A traditional son montuno and a modern timba number ask for different dancing, and knowing which you are in changes what you should do.",
            focus: [
              "Recognise the montuno section and the coro-pregón call and response",
              "Hear a timba band drop into a bloque — the sudden ensemble hit",
              "Save your biggest figures for the section that supports them",
              "Learn to do nothing during a breakdown, deliberately",
            ],
            mistakes: [
              "Dancing the same intensity from first bar to last",
              "Starting a four-bar figure two bars before a break",
            ],
            drill:
              "Listen to one track twice without dancing and map its sections on paper. Then dance it.",
          },
        ],
      },
      {
        id: "cas-x",
        track: "partner",
        name: "Extra learning",
        rank: "Not in the syllabus",
        summary:
          "Written but not currently in the class syllabus. Parked here rather than deleted \u2014 say the word and they go.",
        lessons: [
          {
            id: "cas-2-06",
            title: "Pa'ti pa'mi and changes of place",
            duration: "14 min",
            timing: "Two bars",
            summary:
              "'For you, for me.' A compact exchange of positions used to reset, to buy a bar, or to change direction on a crowded floor. Unglamorous and enormously useful.",
            focus: [
              "Minimal travel — this is a figure for tight spaces",
              "Clear weight change so the direction reversal reads",
              "Use it to change the line of dance when someone blocks you",
              "Chain two together to cover a full phrase",
            ],
            mistakes: [
              "Treating it as filler and dropping the body movement",
              "Over-travelling and defeating the purpose",
            ],
            drill:
              "Dance one full track using only guapea, dile que no and pa'ti pa'mi. Make it interesting anyway.",
          },
          {
            id: "cas-3-01",
            title: "Sombrero doble",
            duration: "16 min",
            timing: "Six bars",
            summary: "Two hat shapes chained with a change of hands between them. A test of arm economy.",
            focus: [
              "No regripping between the two shapes",
              "Leader's footwork stays in the basic throughout",
              "Follower absorbs the wraps through her spine, not her shoulders",
              "Exit is still dile que no — resist the urge to invent one",
            ],
            mistakes: ["Solving arm problems by stopping the feet", "Hands too tight to slide"],
            drill: "First shape only, eight times. Then the join alone. Then the whole thing.",
          },
          {
            id: "cas-3-02",
            title: "Untangling: exits and recovery",
            duration: "21 min",
            timing: "Any",
            summary:
              "The genuinely advanced skill. When a figure goes wrong mid-bar — and it will — how do you get back to guapea without either partner noticing the seam?",
            focus: [
              "Default escape: release the problem hand and lead dile que no",
              "Never fight a wrap; unwind the way it went in",
              "Keep the feet going while the hands are solved — the count is the lifeline",
              "Follower's job in a tangle is to hold her frame and wait, not to guess",
            ],
            mistakes: [
              "Apologising mid-dance, which turns a small error into a stoppage",
              "Yanking to force a shape that has already failed",
            ],
            drill:
              "Deliberately enter setenta with the wrong hand. Find three different ways out. Repeat with sombrero.",
          },
          {
            id: "cas-3-03",
            title: "A contratiempo",
            duration: "18 min",
            timing: "Stepping on the offbeat",
            summary:
              "Shifting your weight changes off the strong beats and onto the offbeats. Common in son and in older casino, and it transforms the texture of everything you already know.",
            focus: [
              "Mark the offbeat with the voice before you mark it with the feet",
              "Transition in and out of contratiempo without losing the phrase",
              "Notice how it changes which instrument you feel closest to",
              "Apply it to guapea first, then to a single familiar figure",
            ],
            mistakes: [
              "Drifting into it accidentally and calling it a choice",
              "Switching mid-figure and stranding your partner",
            ],
            drill:
              "Eight bars a tiempo, eight bars a contratiempo, alternating, for a whole track.",
          },
        ],
      },
      {
        id: "cas-s1",
        track: "solo",
        name: "El cuerpo",
        rank: "Level 1",
        summary:
          "Timing, weight and body movement, with nobody to hold on to.",
        lessons: [
          {
            id: "cas-s1-01",
            title: "Standing on the count",
            duration: "13 min",
            timing: "1-2-3 · 5-6-7 on the spot",
            summary:
              "Before you dance with anyone, you need to keep time on your own. This is the weight-change work everything else sits on.",
            focus: [
              "Mark the count with small weight changes and no travel",
              "Use the same foot pattern the partnered basic uses",
              "Say the count aloud until you no longer need to",
              "Find 1 again after the track has been running a while",
            ],
            mistakes: [
              "Tapping the foot instead of transferring weight",
              "Speeding up whenever the music does",
            ],
            drill:
              "Two minutes on the spot to a slow track, two minutes to a fast one. No arms.",
          },
          {
            id: "cas-s1-02",
            title: "Cuerpo — Cuban body movement",
            duration: "20 min",
            timing: "Continuous, over the basic",
            summary:
              "The look of casino comes from what happens above the knees. This is the isolation work that separates people who know the figures from people who are dancing.",
            focus: [
              "Soft knees: the hip motion is a consequence of the leg straightening, not a hip push",
              "Ribcage moves independently of the pelvis — practise each separately first",
              "Shoulders stay quiet; the movement should not read in the head",
              "Layer it over guapea only once it works standing still",
            ],
            mistakes: [
              "Forcing the hips, which locks the knees and stops the travel",
              "Adding body movement before the timing is secure — one will eat the other",
            ],
            drill:
              "Two minutes of isolations standing still. Two minutes over the basic. Two minutes over enchufla.",
            note: "This applies the isolations from Dance Technique — Body movement. Work through that course first if the movements are new.",
          },
          {
            id: "cas-s1-03",
            title: "Solo basics: b\u00e1sico, side step, forward and back",
            duration: "16 min",
            timing: "Two bars per pattern",
            summary:
              "The three step patterns everything else is built from: the Cuban basic, the side step, and the forward and back. Every warm-up, every shine and every partner figure comes out of these three.",
            focus: [
              "B\u00e1sico — the Cuban basic on the spot: back on 1, replace on 2-3, forward on 5, replace on 6-7",
              "Side step — travelling laterally with a full weight change and no crossing of the feet",
              "Forward and back — small steps, chest lifted, weight staying over the balls of the feet",
              "Change between all three without dropping the count or losing the knee pulse",
            ],
            mistakes: [
              "Leaning backwards on the back step, which strands your weight behind you",
              "Letting the steps grow until you have run out of floor",
            ],
            drill:
              "Eight bars of each in a loop for one whole track. Then shuffle the order at random so you cannot coast on the pattern.",
          },
          {
            id: "cas-s1-04",
            title: "What the arms do",
            duration: "14 min",
            timing: "Continuous",
            summary:
              "With nobody to hold, your arms become the most visible thing about you. This gives them a job.",
            focus: [
              "Establish a rest position — where the arms live when nothing is happening",
              "Let the arms answer the ribcage rather than moving on their own",
              "One shape per phrase, not one per beat",
              "Watch yourself in the mirror with the sound off",
            ],
            mistakes: [
              "Flapping — the arms moving on every count",
              "Frozen arms clamped to the ribs",
            ],
            drill:
              "One track with the arms only in rest position. One track adding a single shape per phrase.",
          },
        ],
      },
      {
        id: "cas-s2",
        track: "solo",
        name: "Estilo",
        rank: "Level 2",
        summary:
          "Turns, styling and footwork for the moments you are dancing apart.",
        lessons: [
          {
            id: "cas-s2-01",
            title: "Turning and spotting",
            duration: "19 min",
            timing: "One turn per 5-6-7",
            summary:
              "Solo turns are a technique problem, not a bravery problem. Prep, axis, spot, land.",
            focus: [
              "Find your axis standing still before you turn at all",
              "Spot a fixed point at eye level and snap back to it",
              "Prepare by winding the ribcage, not swinging the arm",
              "Land on a clean weight change, on the beat",
            ],
            mistakes: [
              "Spotting the floor, which tips the axis forward",
              "Preparing with the arm and arriving off balance",
            ],
            drill:
              "Ten single turns right, ten left, stopping dead on each landing.",
          },
          {
            id: "cas-s2-02",
            title: "Styling for followers",
            duration: "18 min",
            timing: "Inside the gaps",
            summary:
              "The vocabulary followers use in the space casino leaves — during vacílala, during a shine, any time the hand is released.",
            focus: [
              "Hand paths that pass close to the body rather than out in the air",
              "Body rolls initiated from the ribs, not the hips",
              "Time the hair comb to the resolution, not the middle of a bar",
              "Pick two things and do them well rather than six badly",
            ],
            mistakes: [
              "Styling over the lead, so the next figure arrives late",
              "Adding a flourish to every single bar",
            ],
            drill:
              "Dance a track alone with exactly one styled moment per eight bars.",
          },
          {
            id: "cas-s2-03",
            title: "Styling for leaders",
            duration: "15 min",
            timing: "After the resolution",
            summary:
              "Leaders style far less than followers, and the little they do carries a lot. Almost all of it is weight, chest and shoulders.",
            focus: [
              "Weight drops landing on the strong beat",
              "Shoulder and chest isolations kept deliberately small",
              "Use the moment after dile que no — it is the natural gap",
              "Style without letting the lead go soft",
            ],
            mistakes: [
              "Styling with the hands that are supposed to be leading",
              "Borrowing follower vocabulary wholesale",
            ],
            drill:
              "Guapea for a track, adding one weight drop per phrase and nothing else.",
          },
          {
            id: "cas-s2-04",
            title: "Travelling shines",
            duration: "17 min",
            timing: "Four bars out, four back",
            summary:
              "Footwork that covers ground, for the moments you are dancing apart. Useful in rueda, in performance, and on a crowded floor.",
            focus: [
              "Cover distance without lengthening the step",
              "Keep the shine inside the phrase — start and end on 1",
              "Choose a shine that fits the space you actually have",
              "Come back to your partner facing the right way",
            ],
            mistakes: [
              "Shines that overrun the phrase",
              "Travelling so far you cannot get back in time",
            ],
            drill:
              "Four bars out, four bars back, landing on 1. Repeat until it is boring.",
          },
        ],
      },
      {
        id: "cas-s3",
        track: "solo",
        name: "Timba y folklore",
        rank: "Level 3",
        summary:
          "The loose, Afro-rooted vocabulary that opens up once the basics are solid.",
        lessons: [
          {
            id: "cas-s3-01",
            title: "Despelote and tembleque",
            duration: "20 min",
            timing: "Free, over the montuno",
            summary:
              "The loose, shaking, hip-driven body vocabulary that arrived with timba in the nineties. Danced apart from your partner, usually in the hottest section of the track.",
            focus: [
              "Release the knees and let the movement travel up through the torso",
              "Tembleque is a tremor, not a shimmy — it comes from the legs",
              "Stay on the count even while the body is loose",
              "Agree the break with your partner by eye contact, not by pulling away",
            ],
            mistakes: [
              "Adding it to slow son, where it does not belong",
              "Abandoning the rhythm the moment the frame goes",
            ],
            drill: "One montuno section, no partnerwork, staying strictly on the clave.",
          },
          {
            id: "cas-s3-02",
            title: "Afro breaks inside casino",
            duration: "18 min",
            timing: "Two to four bars",
            summary:
              "Cuban social dancers quote Orisha and rumba movement inside a salsa track when the music invites it. Doing this well requires knowing what you are quoting — see the Afro-Cuban strand first.",
            focus: [
              "Listen for the batá or bembé reference in the arrangement before you quote it",
              "Two bars is usually enough; a quote is not a performance",
              "Match the specific Orisha the music suggests rather than picking at random",
              "Return to the basic cleanly so it reads as deliberate",
            ],
            mistakes: [
              "Quoting Orisha movement decoratively, with no idea whose it is",
              "Holding the break so long that the partnership breaks down",
            ],
            drill:
              "Work through the Afro-Cuban strand, then find three tracks whose arrangement contains a genuine Afro reference.",
            note: "Complete 'Before you begin' in the Afro-Cuban strand before working on this lesson.",
          },
          {
            id: "cas-s3-03",
            title: "Rumba in the salsa room",
            duration: "17 min",
            timing: "Two bars at a time",
            summary:
              "Guaguancó vocabulary turns up constantly in Cuban social dancing. Borrowing it well means knowing it first.",
            focus: [
              "Take the guaguancó basic to salsa tempo and see what survives",
              "Two bars is a quote; eight bars is a different dance",
              "Read whether your partner wants to play or wants to keep dancing casino",
              "Return to the basic cleanly so it reads as deliberate",
            ],
            mistakes: [
              "Quoting vacunao at a stranger without reading the room",
              "Using rumba shapes with salsa timing underneath them",
            ],
            drill:
              "Work through the Rumba course, then find three salsa tracks with a rumba section.",
            note: "Work through the Rumba course before this lesson.",
          },
          {
            id: "cas-s3-04",
            title: "Building a solo",
            duration: "20 min",
            timing: "A full track",
            summary:
              "Putting your vocabulary together into something that holds up for a whole track, with no partner and no choreography.",
            focus: [
              "Start from the music's structure, not from a list of moves",
              "Repeat things — a solo with no repetition reads as panic",
              "Leave gaps; stillness is part of the vocabulary",
              "Film it, watch it once, fix one thing",
            ],
            mistakes: [
              "Emptying your entire repertoire in the first sixteen bars",
              "Never repeating anything, so nothing registers",
            ],
            drill:
              "One track, filmed. Watch it once, write down one change, film it again.",
          },
        ],
      },
    ],
  },
  {
    id: "son",
    name: "Son Cubano",
    spanish: "El Son",
    accent: "#0F4E8C",
    clave: "son23",
    blurb:
      "The parent of everything else on this site. Older, quieter, danced close and low to the ground, with the weight changes falling off the strong beats.",
    levels: [
      {
        id: "son-a",
        name: "Los fundamentos",
        rank: "01",
        summary:
          "Where the music comes from and how the timing works. Do not skip these two.",
        lessons: [
          {
            id: "son-01",
            title: "Where son comes from",
            duration: "18 min",
            timing: "Listening",
            summary:
              "Son grew in eastern Cuba and reached Havana in the early twentieth century, carried by the sextetos and septetos. Knowing the shape of the music tells you what the dance is for, and why it behaves so differently from casino.",
            focus: [
              "Hear the tres, the bong\u00f3 and the bass in a classic septeto recording",
              "Identify the largo section and the montuno that follows it",
              "Notice how much space there is compared with a timba track",
              "Build a listening list of ten recordings before you dance a step",
            ],
            mistakes: [
              "Treating son as slow salsa — it is a different dance with its own logic",
              "Skipping the listening and going straight to the footwork",
            ],
            drill:
              "Ten recordings in one sitting, no dancing. Write down what changes between them.",
          },
          {
            id: "son-02",
            title: "Son timing, the b\u00e1sico and the sostenido",
            duration: "26 min",
            timing: "Weight on 2-3-4 and 6-7-8",
            summary:
              "The two things that define son: weight changes that sit off the strong beat, and the held, suspended pause that resolves late. Learn them together, because the pause only makes sense once the contratiempo is in your body. Schools count this differently; this is how we teach it.",
            focus: [
              "Mark 1 with a tap or a hold, then take weight on 2-3-4",
              "Dance the b\u00e1sico on son timing — same shape as casino, completely different feel",
              "Say the count aloud with the emphasis on the tap, not on the steps",
              "Sostenido: suspend by continuing to rise, never by freezing",
              "Resolve the pause later than feels comfortable, and agree it with your partner",
            ],
            mistakes: [
              "Sliding back onto salsa timing after four bars",
              "Making the tap heavy, which turns it into a step",
              "Pausing so often that the dance loses its pulse",
            ],
            drill:
              "Two minutes marking the timing standing still, hands on hips. Then the b\u00e1sico for two minutes. Then add one sostenido per eight bars at the same point each time, and only after that start varying where it lands.",
          },
        ],
      },
      {
        id: "son-b",
        name: "Calentamiento",
        rank: "02",
        summary:
          "The solo and paired preparation we run before any son partnerwork.",
        lessons: [
          {
            id: "son-03",
            title: "Son solo warm up",
            duration: "20 min",
            timing: "Slow, before partnerwork",
            summary:
              "The solo preparation we run before any son partnerwork: posture, small steps, and getting the contratiempo into the feet while you still have nobody to blame.",
            focus: [
              "Walk the son timing on your own, forwards and backwards, tiny steps",
              "Keep the level — son does not bounce the way casino does",
              "Lateral travel with the torso arriving before the foot lands",
              "Practise stopping dead on the tap and holding it for a full count",
            ],
            mistakes: [
              "Warming up at casino tempo and carrying the bounce into son",
              "Taking salsa-sized steps and running out of room by bar four",
            ],
            drill:
              "Ten minutes solo before every son class: timing on the spot, then walking, then lateral, then the pause.",
          },
          {
            id: "son-04",
            title: "The son frame and partner warm up",
            duration: "19 min",
            timing: "Closed hold",
            summary:
              "Closed hold, upright carriage, and a connection subtle enough that a bystander cannot see the lead. Plus the paired warm up that gets two people breathing on the same count.",
            focus: [
              "Contact through the frame, not through grip",
              "Shoulders down and level; leave a consistent gap between you",
              "Warm up by walking together in hold, in silence, before adding music",
              "Follower's tone answers the leader's without anticipating",
            ],
            mistakes: [
              "Gripping the follower's back to steer her",
              "Collapsing the frame the moment a turn starts",
            ],
            drill:
              "Dance one track with the leader's hands resting on his own shoulders. Lead entirely through the body.",
          },
        ],
      },
      {
        id: "son-c",
        name: "Pareja",
        rank: "03",
        summary:
          "Partnerwork, in the order we teach it. Each lesson assumes the one before.",
        lessons: [
          {
            id: "son-05",
            title: "Son partnerwork: the basics",
            duration: "24 min",
            timing: "Contratiempo throughout",
            summary:
              "The three things every son partner sequence is built from: the b\u00e1sico in hold, forward and back, and the cross body lead — dile que s\u00ed, son's answer to casino's dile que no.",
            focus: [
              "B\u00e1sico in closed hold, both partners on the contratiempo",
              "Forward and back as a couple, keeping the shared centre still",
              "Cross body lead / dile que s\u00ed — she walks the line, he clears it",
              "Resolve every figure back into the b\u00e1sico before trying the next",
            ],
            mistakes: [
              "Leading dile que s\u00ed with the arm rather than by stepping out of the way",
              "Losing the contratiempo the moment the couple starts travelling",
            ],
            drill:
              "B\u00e1sico, forward and back, dile que s\u00ed, b\u00e1sico. Sixteen times without stopping the music.",
          },
          {
            id: "son-06",
            title: "Son partnerwork: pauses and openings",
            duration: "23 min",
            timing: "Two to four bars per figure",
            summary:
              "Adding air to the partnership: held pauses inside a figure, the open cross body lead, and the follower walking around the leader.",
            focus: [
              "Son pauses taken together — both partners suspend, neither stops",
              "Cross body lead open: the same lead with the hold released to one hand",
              "Mujeres — the follower walking a full circle around the leader, on her own timing",
              "Leader keeps a quiet b\u00e1sico while she travels; he is the axis, not the driver",
            ],
            mistakes: [
              "Pausing alone, which reads as a mistake rather than a choice",
              "Rushing the walk-around and arriving with two beats to spare",
            ],
            drill:
              "One track using only these three. Make the pauses land in the same place in each phrase, then move them.",
          },
          {
            id: "son-07",
            title: "Son partnerwork: solo steps and travel",
            duration: "22 min",
            timing: "Full phrases",
            summary:
              "The moments you dance apart, and how the couple moves around the floor: son solo steps, the Cuban walk, and directional steps.",
            focus: [
              "Son solo steps — released, but still on the contratiempo and still small",
              "Cuban walk: long, level, unhurried travel with the weight forward",
              "Directional steps — changing the couple's line without breaking the frame",
              "Come back into hold on 1, not a beat later",
            ],
            mistakes: [
              "Turning the solo section into casino shines",
              "Travelling so far apart that the return costs a whole phrase",
            ],
            drill:
              "Four bars apart, four bars back in hold, for a whole track. The joins should be invisible.",
          },
          {
            id: "son-08",
            title: "Son partnerwork: tornillos",
            duration: "21 min",
            timing: "Four to six bars",
            summary:
              "The advanced turning figures, led and followed. Tornillos are where the son frame is genuinely tested — the connection has to survive rotation without either partner gripping.",
            focus: [
              "Leader initiates the rotation from the body, never from the hand",
              "Follower keeps her own axis through the turn; she is not being spun",
              "Maintain the level — no rise or drop through the rotation",
              "Exit into the b\u00e1sico on the contratiempo, on time",
            ],
            mistakes: [
              "Gripping to hold the shape together",
              "Attempting these before the frame lesson is genuinely solid",
            ],
            drill:
              "Walk the shape at quarter speed with no music, four times, then add a slow track.",
            note: "I have read 'Tournios' as tornillos — tell your teacher if this is a different figure and it will be corrected.",
          },
        ],
      },
    ],
  },
  {
    id: "rumba",
    name: "Rumba",
    spanish: "Rumba Cubana",
    accent: "#F0911E",
    clave: "rumba32",
    blurb:
      "Not a ballroom dance. Cuban rumba is a percussion and dance tradition from the solares and dockyards of Havana and Matanzas. We teach guaguanc\u00f3.",
    levels: [
      {
        id: "rum-1",
        name: "Guaguanc\u00f3",
        rank: "01",
        summary:
          "The rumba we teach, in the order we teach it.",
        lessons: [
          {
            id: "rum-01",
            title: "Rumba in context",
            duration: "20 min",
            timing: "Listening and background",
            summary:
              "What rumba actually is, the words you will hear, and when it is danced. Rumba is a secular tradition, but it is a living community practice rather than a set of steps for export, and the setting matters.",
            focus: [
              "The solar, the caj\u00f3n, and the shift from boxes to conga drums",
              "Key terms: rumb\u00f3n (the gathering), quinto (the talking drum), tres dos and salidor, palitos and cat\u00e1",
              "The three styles named: yamb\u00fa, guaguanc\u00f3, columbia — and which we teach",
              "When rumba is danced: at a rumb\u00f3n, at parties, and briefly inside a salsa track — not as a floor-filler",
              "Havana and Matanzas styles, and why they sound different",
            ],
            mistakes: [
              "Approaching rumba as choreography rather than conversation",
              "Assuming the class version and the street version are the same thing",
            ],
            drill:
              "Watch three rumbas filmed in Cuba. For each, write down who is leading the rhythm, and how the dancers answer the quinto.",
          },
          {
            id: "rum-02",
            title: "Rumba clave",
            duration: "14 min",
            timing: "3–2 and 2–3",
            summary:
              "One stroke separates rumba clave from son clave, and that stroke changes the whole feel. Get it wrong and everything built on top sits wrong.",
            focus: [
              "Locate the third stroke — a semiquaver later than in son clave",
              "Clap rumba clave against a son clave recording to feel the clash",
              "Play the palitos pattern over the top",
              "Sing the clave out loud while walking the guaguanc\u00f3 basic",
            ],
            mistakes: [
              "Hearing the difference but defaulting back to son clave under pressure",
              "Clapping loudly and rushing — clave is steady, not emphatic",
            ],
            drill:
              "Sixty seconds of rumba clave with a metronome sounding only on beats 2 and 4.",
          },
          {
            id: "rum-03",
            title: "Guaguanc\u00f3: the bounce and the body",
            duration: "19 min",
            timing: "Rumba clave 3–2",
            summary:
              "Before any steps, the body. Guaguanc\u00f3 has a low, continuous bounce and a loose upper body, and without those the footwork looks like salsa done badly.",
            focus: [
              "Grounded and wide, weight low, with a constant subtle bounce",
              "The bounce comes from the knees and never stops, even when the feet do",
              "Shoulders and ribs stay loose and answer the drums",
              "Arms are alive and independent — framing, not posing",
            ],
            mistakes: [
              "Dancing it upright, like a partner dance",
              "Copying the shapes without the weight underneath them",
            ],
            drill:
              "Four minutes of bounce and body only, no steps, to a live-feel recording.",
          },
          {
            id: "rum-04",
            title: "Guaguanc\u00f3: the basic steps",
            duration: "21 min",
            timing: "Rumba clave 3–2",
            summary:
              "Three basics, in the order we teach them. Each one keeps the bounce from the previous lesson running underneath.",
            focus: [
              "On the spot — marking the clave with weight changes and no travel",
              "Side step base — the stationary side-to-side, feet apart, weight low",
              "Side step moving — the same shape travelling across the floor",
              "Change between all three without losing the bounce or the clave",
            ],
            mistakes: [
              "Standing up as soon as the feet start travelling",
              "Letting the steps get wide and slow so they drift off the clave",
            ],
            drill:
              "Eight bars of each in a loop for a whole track, then shuffle the order at random.",
          },
          {
            id: "rum-05",
            title: "Guaguanc\u00f3: the kach\u00e1n",
            duration: "18 min",
            timing: "Called by the quinto",
            summary:
              "The kach\u00e1n is the characteristic travelling movement of guaguanc\u00f3 — the low, gathering step that carries a dancer around the space and sets up everything that follows.",
            focus: [
              "Keep the weight low throughout; the movement travels, the height does not",
              "Lead with the hip and let the foot follow",
              "Stay on the quinto — it tells you when to move and when to wait",
              "Use it to circle your partner rather than to cross the room",
            ],
            mistakes: [
              "Rising up as the step travels, which flattens the whole look",
              "Repeating it metronomically instead of answering the drum",
            ],
            drill:
              "Two minutes circling an imaginary partner, changing direction whenever the quinto changes.",
          },
          {
            id: "rum-06",
            title: "Guaguanc\u00f3: vacunao and botao",
            duration: "22 min",
            timing: "Called by the quinto",
            summary:
              "The pursuit at the centre of guaguanc\u00f3: the man's vacunao and the woman's botao that blocks it. It is a game of timing and wit, and both halves matter equally.",
            focus: [
              "The vacunao is a marked, precise gesture, not a lunge",
              "The botao is active defence — she is reading him, not reacting late",
              "Listen for the quinto marking the moment",
              "Agree distance and contact before you start, every single time",
            ],
            mistakes: [
              "Treating it as aggression rather than play",
              "The woman conceding, which removes the entire point of the dance",
            ],
            drill:
              "Slow tempo, three exchanges only, with the woman blocking every one. Then let one through and see how it changes the game.",
            note: "Consent and comfort come first. Tell your teacher if you would rather work on the solo vocabulary instead.",
          },
        ],
      },
      {
        id: "rum-x",
        name: "Extra learning",
        rank: "Not taught in class",
        summary:
          "Yamb\u00fa and columbia are not part of our current classes. They are here so you know what they are and how they differ.",
        lessons: [
          {
            id: "rum-x1",
            title: "Yamb\u00fa",
            duration: "16 min",
            timing: "Slow, on cajones",
            summary:
              "The oldest of the three styles, slow and played on boxes. There is a saying that in yamb\u00fa there is no vacunao — the flirtation is implied rather than acted.",
            focus: [
              "Half the speed, twice the detail",
              "Movement quality suggests age and dignity, deliberately",
              "Caj\u00f3n timbre changes what the body wants to do — listen before moving",
              "No vacunao; the tension has to come from somewhere else",
            ],
            mistakes: [
              "Importing guaguanc\u00f3's attack into yamb\u00fa",
              "Mistaking slow for easy",
            ],
            drill:
              "One full yamb\u00fa recording, danced solo, without repeating a single gesture.",
            note: "Not currently taught in class — background reading for anyone who wants to go further.",
          },
          {
            id: "rum-x2",
            title: "Columbia",
            duration: "18 min",
            timing: "6/8 bell",
            summary:
              "Fast, solo and competitive, in 6/8, traditionally danced by men in a rural style with a strong element of display and challenge.",
            focus: [
              "Internalise the 6/8 bell before attempting any footwork",
              "Short bursts — columbia is phrased in statements, not paragraphs",
              "The dancer duels the quinto, not the other dancers",
              "Stability over height: land everything",
            ],
            mistakes: [
              "Counting it in four",
              "Chasing acrobatics before the rhythm is secure",
            ],
            drill:
              "Clap the bell for two minutes. Then dance eight bars, rest, and repeat.",
            note: "Not currently taught in class — background reading for anyone who wants to go further.",
          },
        ],
      },
    ],
  },
  {
    id: "afro",
    name: "Afro-Cuban",
    spanish: "Bailes de Orishas",
    accent: "#0F4E8C",
    clave: "bell68",
    blurb:
      "The Orisha dances of the Lucum\u00ed tradition, danced to bat\u00e1 drums. These movements carry religious meaning. We teach them with that stated, not stripped out.",
    levels: [
      {
        id: "afr-0",
        name: "Antes de empezar",
        rank: "01",
        summary:
          "Context and the drums. The first lesson is compulsory before any movement.",
        lessons: [
          {
            id: "afr-01",
            title: "Before you begin: context and respect",
            duration: "22 min",
            timing: "No movement",
            summary:
              "These dances belong to a living religious tradition brought to Cuba by enslaved Yoruba people. What we teach is the folkloric form. Knowing the difference is part of learning the dance, not a disclaimer attached to it.",
            focus: [
              "The distinction between a ceremonial context and a folkloric or stage context",
              "What we do not teach here, and why that boundary exists",
              "Why each Orisha's movement is specific rather than interchangeable",
              "Attributes, colours and numbers vary between houses and lineages — what follows is how we teach it, not the only version",
              "How to talk about what you are learning without misrepresenting it",
            ],
            mistakes: [
              "Treating Orisha movement as a styling pack for salsa",
              "Wearing or handling ritual items as costume",
            ],
            drill:
              "Read the recommended background material and bring one question to class.",
            note: "Compulsory before any other lesson in this course.",
          },
          {
            id: "afr-02",
            title: "Bat\u00e1 and the toques",
            duration: "19 min",
            timing: "6/8 and 4/4 toques",
            summary:
              "The three double-headed drums — iy\u00e1, it\u00f3tele and ok\u00f3nkolo — and the rhythms that call each Orisha. The dance answers a specific toque, so the ear comes first.",
            focus: [
              "Identify the three drums by pitch and role",
              "Learn to recognise three toques by ear before dancing to any of them",
              "The drums lead and the dancer responds, never the other way round",
              "Note which toques are in 6/8 and which are not",
            ],
            mistakes: [
              "Dancing generically over anything that sounds Afro-Cuban",
              "Treating the ok\u00f3nkolo's steadiness as background noise",
            ],
            drill:
              "Three toques, ten minutes each, listening only. Name them without looking.",
          },
        ],
      },
      {
        id: "afr-1",
        name: "Los Orishas",
        rank: "02",
        summary:
          "One lesson each. Who they are, what they carry, and their basic steps.",
        lessons: [
          {
            id: "afr-03",
            title: "Elegu\u00e1",
            duration: "18 min",
            timing: "6/8",
            summary:
              "The one who opens the way, and the first to be honoured at any gathering. He is a child and a trickster at once, and the movement has to carry both — quick, low, and never where you expect it.",
            attributes: [
              { label: "Domain", value: "Crossroads, doorways, beginnings and endings" },
              { label: "Character", value: "Child-like, mischievous, quick, impossible to predict" },
              { label: "Embodies", value: "Chance, possibility, the opening and closing of paths" },
              { label: "Carries", value: "The garabato, a hooked stick for clearing the way" },
              { label: "Colours", value: "Red and black" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "El garabato — the hooked stick sweeping low across the body to clear the path",
              "Travelling walk kept very low, with sudden changes of direction",
              "The spin and stop — a fast turn ending in total stillness",
              "Playful skips and small kicks, thrown off balance and recovered",
              "Sharp head turns, looking behind as though followed",
            ],
            mistakes: [
              "Playing it for laughs rather than for speed",
              "Standing tall, which loses the character completely",
            ],
            drill:
              "Eight bars travelling low with three unannounced changes of direction.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
          {
            id: "afr-04",
            title: "Og\u00fan",
            duration: "18 min",
            timing: "6/8",
            summary:
              "The blacksmith and the warrior who cuts the path through the bush. Everything about the movement is effort — sustained, heavy, driven from the back rather than the arms.",
            attributes: [
              { label: "Domain", value: "Iron, tools, war, work and the forest" },
              { label: "Character", value: "Relentless, blunt, tireless, quick to anger" },
              { label: "Embodies", value: "Labour, force, the clearing of obstacles" },
              { label: "Carries", value: "The machete, and the tools of the blacksmith" },
              { label: "Colours", value: "Green and black" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "The machete chop — a diagonal cut across the body, driven from the back",
              "Clearing the undergrowth — low sweeping cuts, alternating sides",
              "The forge — hammering downward with the weight dropping into the floor",
              "Wide travelling stride with the torso pitched forward",
              "Wiping the brow — the pause that marks the labour",
            ],
            mistakes: [
              "Using arm effort with no support from the legs",
              "Blending him with Ochosi into one generic warrior",
            ],
            drill:
              "Sixteen bars of chopping, then sixteen of forging. The effort should never let up.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
          {
            id: "afr-05",
            title: "Ochosi",
            duration: "17 min",
            timing: "6/8",
            summary:
              "The hunter who never misses. Where Og\u00fan is sustained force, Ochosi is stillness and then one exact movement — the contrast between them is the whole lesson.",
            attributes: [
              { label: "Domain", value: "Hunting, tracking, justice and the forest" },
              { label: "Character", value: "Precise, watchful, patient, decisive" },
              { label: "Embodies", value: "Accuracy, justice, the single well-aimed action" },
              { label: "Carries", value: "The bow and arrow" },
              { label: "Colours", value: "Blue and yellow in most houses; lilac in some" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "Drawing the bow — arm back, chest open, weight settling",
              "The aim — complete stillness with the eyes fixed",
              "The release — a sharp forward extension, and nothing else moving",
              "The stalk — low, silent travelling steps",
              "Shading the eyes to scan the horizon",
            ],
            mistakes: [
              "Rushing the aim, which is where the whole character lives",
              "Carrying Og\u00fan's heaviness into his movement",
            ],
            drill:
              "Sixteen bars Og\u00fan, sixteen bars Ochosi, back to back. Feel the change of effort.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
          {
            id: "afr-06",
            title: "Yemay\u00e1",
            duration: "19 min",
            timing: "6/8",
            summary:
              "Mother of the sea and of all living things. The movement is continuous undulation — the hardest thing here is that it never stops and never has a sharp edge.",
            attributes: [
              { label: "Domain", value: "The sea, motherhood, the surface of the ocean" },
              { label: "Character", value: "Nurturing and vast, with sudden fury underneath" },
              { label: "Embodies", value: "Motherhood, the womb, the ocean itself" },
              { label: "Carries", value: "A fan; her skirt is the sea" },
              { label: "Colours", value: "Blue and white" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "The wave — undulation initiated at the pelvis, travelling up through the spine",
              "Skirt work — gathering and casting the fabric like water",
              "The rowing step — arms pulling as though moving through water",
              "Travelling side to side with the wave unbroken",
              "The dive — sinking and rising through the knees",
            ],
            mistakes: [
              "Waving the arms while the spine stays rigid",
              "Punctuating — Yemay\u00e1 does not stop and start",
            ],
            drill:
              "Two minutes of continuous undulation with no repetition and no pause.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
          {
            id: "afr-07",
            title: "Och\u00fan",
            duration: "18 min",
            timing: "6/8",
            summary:
              "The river to Yemay\u00e1's ocean: lighter, smaller, more inward. Her attention turns towards herself rather than out to a room, and getting that right is what separates her from imitation.",
            attributes: [
              { label: "Domain", value: "Rivers, fresh water, love, sweetness and wealth" },
              { label: "Character", value: "Flirtatious, generous, laughing — and dangerous when slighted" },
              { label: "Embodies", value: "Beauty, sensuality, fertility, honey" },
              { label: "Carries", value: "A mirror, a fan, and a jug of river water" },
              { label: "Colours", value: "Yellow and gold" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "The mirror — admiring herself, attention turned inward",
              "Bathing in the river — hands drawing water over the arms and shoulders",
              "The laugh — head back, shoulders shaking",
              "Small contained hip circles, lighter and tighter than Yemay\u00e1's",
              "Fanning — the detail lives in the wrist, close to the body",
            ],
            mistakes: [
              "Playing it as flirtation aimed at the room",
              "Copying Yemay\u00e1's amplitude",
            ],
            drill:
              "Alternate eight bars Yemay\u00e1, eight bars Och\u00fan. The switch must be visible from across the room.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
          {
            id: "afr-08",
            title: "Chang\u00f3",
            duration: "19 min",
            timing: "6/8",
            summary:
              "Thunder and kingship. Broad, grounded, powerful movement that switches without warning between complete stillness and full force — the contrast is the character.",
            attributes: [
              { label: "Domain", value: "Thunder, lightning, fire, drums and kingship" },
              { label: "Character", value: "Proud, magnetic, hot-tempered" },
              { label: "Embodies", value: "Force, justice through power, virility, the drum" },
              { label: "Carries", value: "The och\u00e9, a double-headed axe" },
              { label: "Colours", value: "Red and white" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "The axe raised — och\u00e9 held high in both hands, stance wide",
              "Thunder claps — sudden accents thrown from stillness",
              "The strut — a kingly travelling walk with the chest lifted",
              "The grind — slow, grounded pelvic movement, the virility motif",
              "The stamp — driving the heel into the floor to call the thunder",
            ],
            mistakes: [
              "Constant intensity, which flattens every accent",
              "Puffing the chest instead of grounding through the legs",
            ],
            drill:
              "Four bars still, four bars at full force, repeated. Make the contrast extreme.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
          {
            id: "afr-09",
            title: "Oy\u00e1",
            duration: "18 min",
            timing: "6/8",
            summary:
              "The storm. Continuous turning and sweeping, faster than anything else in this course, and the reason her lesson sits next to Obatal\u00e1's — they are the two ends of the range.",
            attributes: [
              { label: "Domain", value: "Wind, storms, change, and the gates of the cemetery" },
              { label: "Character", value: "Fierce, fast, uncontainable" },
              { label: "Embodies", value: "Transformation, the whirlwind, the boundary between life and death" },
              { label: "Carries", value: "The iruke, a horsetail whisk; sometimes a machete" },
              { label: "Colours", value: "Burgundy and brown, or nine colours together" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "The whirlwind — continuous turning with the iruke sweeping ahead of the body",
              "Sweeping the air — broad arcs clearing the space",
              "Fast travelling turns across the floor",
              "The sudden stop — the storm dropping out",
              "Shaking the whisk overhead",
            ],
            mistakes: [
              "Spinning without the sweep, which is just turning",
              "Losing the axis by going faster than you can control",
            ],
            drill:
              "Thirty seconds of continuous turning, then a dead stop held for four bars.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
          {
            id: "afr-10",
            title: "Obatal\u00e1",
            duration: "20 min",
            timing: "6/8",
            summary:
              "The elder, and the hardest control task in this course. Extreme slowness with no wobble exposes everything — there is nowhere to hide. Note that Obatal\u00e1 has several roads, some youthful and warrior-like; we teach the elder.",
            attributes: [
              { label: "Domain", value: "Purity, wisdom, the head, and the shaping of human bodies" },
              { label: "Character", value: "Calm, dignified, unhurried, just" },
              { label: "Embodies", value: "Peace, clarity, the cool head" },
              { label: "Carries", value: "A white horsetail whisk, and sometimes a staff" },
              { label: "Colours", value: "White" },
            ],
            focusLabel: "Basic steps",
            focus: [
              "The slow walk — travelling as slowly as you can hold, with total control",
              "Blessing — hands passing over the head and outward",
              "Smoothing the cloth — calm sweeping gestures at waist height",
              "The elder's tremble — a slight, deliberate unsteadiness",
              "Stillness held — sustained balance with nothing moving",
            ],
            mistakes: [
              "Rushing because slow feels exposed",
              "Adding decoration to fill the time",
            ],
            drill:
              "Two minutes of the slow walk, as slow as you can hold it. Then thirty seconds of Oy\u00e1, and notice what your body has to change.",
            note: "Taught in the folkloric form, outside any ceremonial context. Complete 'Before you begin' first.",
          },
        ],
      },
    ],
  },
  {
    id: "rueda",
    name: "Rueda de Casino",
    spanish: "La Rueda",
    accent: "#F0911E",
    clave: "son32",
    blurb:
      "Casino danced in a circle to figures shouted by a caller. Less about knowing figures than about arriving at the same moment as everyone else. Calls vary between cities and schools \u2014 these are the Solent set.",
    levels: [
      {
        id: "rue-1",
        name: "La Rueda",
        rank: "01",
        summary:
          "Take these in order. Everything from lesson four on assumes you can pass a partner cleanly.",
        lessons: [
          {
            id: "cas-r-01",
            title: "How the wheel works, and how to call it",
            duration: "22 min",
            timing: "Everyone on the same 1",
            summary:
              "The caller, the circle, the shared count and the etiquette \u2014 plus your first go at calling. Calling is in this lesson rather than at the end because it is the fastest way to understand rueda timing, and everyone in the wheel should be able to do it.",
            focus: [
              "The call lands roughly a bar before the figure begins \u2014 listen ahead",
              "Keep the circle round and evenly spaced; gaps are what break the passes",
              "If you miss a call, rejoin at the next dile que no rather than improvising",
              "Calling: give the call on the phrase before, loudly, with your hand up",
              "Call figures the least experienced person present can dance \u2014 the wheel is only as good as its slowest couple",
              "Never call two unfamiliar figures back to back",
            ],
            mistakes: [
              "Starting the figure on the call instead of on the next 1",
              "Calling to show off your own repertoire",
              "Stopping dead when you lose it, which blocks the couple behind you",
            ],
            drill:
              "Walk the circle with no partners, responding to calls with the correct direction only. Then take a turn as caller for one full track, with a vocabulary of six figures and no more.",
          },
          {
            id: "cas-r-02",
            title: "Dame, dame dos, dame una",
            duration: "16 min",
            timing: "One or two passes",
            summary:
              "'Give me.' The partner changes that make a rueda a rueda. Everything else in the wheel is scaffolding around these.",
            focus: [
              "Release early enough that the next leader has somewhere to arrive",
              "Followers travel a consistent distance so the wheel does not deform",
              "Dame dos means passing two positions, not rushing one",
              "Arrive already in guapea, not sorting out hands",
            ],
            mistakes: [
              "Holding on half a beat too long and jamming the pass",
              "Leaders travelling instead of followers, or both at once",
            ],
            drill: "Dame on every second phrase for a whole track, with no other calls.",
          },
          {
            id: "cas-r-03",
            title: "Enchufla y dame",
            duration: "13 min",
            timing: "Two bars plus the pass",
            summary: "The workhorse call. An enchufla that resolves into a partner change rather than back to guapea.",
            focus: [
              "The enchufla is unchanged — only the exit differs",
              "Release on the resolution, not during the travel",
              "Follower's momentum carries her onward rather than stopping",
              "Doble variant: two enchuflas, one pass at the end",
            ],
            mistakes: ["Releasing early, which turns it into a shove", "Passing to the wrong side"],
            drill: "Alternate enchufla y dame with plain enchufla so the release becomes a choice.",
          },
          {
            id: "cas-r-fly",
            title: "Fly, fly doble, fly triple",
            duration: "14 min",
            timing: "Landing on 1",
            clips: [
              { id: "cas-r-fly-a", label: "Fly", video: null },
              { id: "cas-r-fly-b", label: "Fly doble", video: null },
              { id: "cas-r-fly-c", label: "Fly triple", video: null },
            ],
            summary:
              "The first of the calls that exist to make the wheel sound and look like one thing rather than twelve. A fly is a jump and a clap taken by everyone at the same instant \u2014 exactly as simple and as difficult as that sounds.",
            focus: [
              "Fly \u2014 everyone leaves the floor and claps together, landing on 1",
              "Fly doble \u2014 two in succession with no bar in between",
              "Fly triple \u2014 three, which is where most wheels come apart",
              "Jump from both feet and land soft, letting the knees bend",
              "Watch the couple opposite you, not the caller, to stay together",
            ],
            mistakes: [
              "Jumping when you hear the call instead of on the next 1",
              "Landing stiff-legged \u2014 loud, and hard on the knees",
            ],
            drill:
              "Fly on every eighth bar for a whole track, then doble, then triple. If the claps are not a single sound, the wheel is not together.",
          },
          {
            id: "cas-r-pel",
            title: "Pelota \u2014 y una, y dos, y tres",
            duration: "19 min",
            timing: "One pass per phrase",
            clips: [
              { id: "cas-r-pel-a", label: "Pelota y una", video: null },
              { id: "cas-r-pel-b", label: "Pelota y dos", video: null },
              { id: "cas-r-pel-c", label: "Pelota y tres", video: null },
            ],
            summary:
              "The follower is sent across the wheel rather than round it \u2014 thrown like a ball and caught on the other side. Y una, y dos and y tres stack the passes up, and the difficulty climbs quickly because the circle has to hold its shape while people cross through it.",
            focus: [
              "Pelota y una \u2014 a single pass across the circle",
              "Y dos and y tres \u2014 the same pass repeated with no reset between them",
              "Look for your destination before you send anyone anywhere",
              "Agree a lane: two followers crossing the same line is the only real hazard here",
              "The circle must not shrink while people are travelling through the middle of it",
            ],
            mistakes: [
              "Sending before the receiving leader is ready for her",
              "Letting the wheel collapse inwards to close the gap",
            ],
            drill:
              "Y una until it is boring. Only then add the second. Six couples minimum \u2014 with four it teaches nothing.",
          },
          {
            id: "cas-r-med",
            title: "Enchufla al medio",
            duration: "21 min",
            timing: "Four to eight bars",
            clips: [
              { id: "cas-r-med-a", label: "Enchufla al medio", video: null },
              { id: "cas-r-med-b", label: "Hombre de la derecha", video: null },
              { id: "cas-r-med-c", label: "Hombre de la izquierda", video: null },
              { id: "cas-r-med-d", label: "Aplauso", video: null },
              { id: "cas-r-med-e", label: "La flor", video: null },
            ],
            summary:
              "The calls that break the ring and send everyone inward. Once the wheel is inside itself the usual spacing rules stop applying, so these need more discipline than anything else in the course, not less.",
            focus: [
              "Enchufla al medio \u2014 the enchufla resolves into the centre instead of back to guapea",
              "Hombre de la derecha and hombre de la izquierda \u2014 the leaders travel to the follower on that side",
              "Aplauso \u2014 the clap taken together in the middle, on the beat, as one sound",
              "La flor \u2014 the shape the wheel makes closed in; keep the petals even",
              "Come back out to the diameter you started with, not a smaller one",
            ],
            mistakes: [
              "Crowding the centre until nobody can move",
              "Reforming a circle two feet tighter than the one you left",
            ],
            drill:
              "Al medio and straight back out, eight times, before you add a single variant.",
            note: "Written here as 'la flor', the flower \u2014 correct it if we call it something else in class.",
          },
          {
            id: "cas-r-04",
            title: "Prima and prima con la hermana",
            duration: "17 min",
            timing: "Back break, turn, travel",
            summary:
              "Prima closes the couple, turns them together, and sends the leader on to the next follower. Some schools teach this figure under the name adi\u00f3s; we call it prima.",
            focus: [
              "From guapea: back break, then gather the follower in close with her right arm raised",
              "Turn together as a couple \u2014 you are not turning her, you are turning with her",
              "Release on the resolution and travel on to the next follower on your right",
              "Prima con la hermana: instead of leaving straight away, turn out and enchufla on to the next follower",
              "Keep the circle's diameter steady while the leaders travel",
            ],
            mistakes: [
              "Turning the follower instead of turning with her",
              "Leaving before the turn has resolved, which pulls her off balance",
            ],
            drill:
              "Prima on every second phrase for a whole track, then alternate prima and dame so the two passes stop blurring into each other.",
          },
          {
            id: "cas-r-05",
            title: "Setenta and sombrero in the wheel",
            duration: "17 min",
            timing: "Four to five bars",
            summary:
              "Familiar figures under wheel discipline. The difficulty is not the figure — it is doing it in exactly the same number of bars as eleven other people.",
            focus: [
              "Strip the figure back to its plainest version for rueda",
              "Everyone exits on the same beat; no personal flourishes on the resolution",
              "Watch the couple opposite, not the couple next to you, to check timing",
              "Be ready for a dame immediately afterwards",
            ],
            mistakes: [
              "Adding styling that costs half a bar",
              "Finishing early and standing still, which is as disruptive as finishing late",
            ],
            drill: "Call setenta, dame, setenta, dame for a full track at moderate tempo.",
          },
          {
            id: "cas-r-06",
            title: "Balsero, Kentucky, Coca-Cola",
            duration: "18 min",
            timing: "Three to five bars each",
            summary:
              "Three named calls with strong characters. Learn them as shapes with a recognisable silhouette so the wheel stays readable from the outside.",
            focus: [
              "Balsero: the rowing action reads across the circle — commit to it",
              "Kentucky: the wrap and release must be the same size for everyone",
              "Coca-Cola in the wheel keeps the leader's travelling path but tightens it",
              "Check our version against the one you learn elsewhere — regional variants are normal",
            ],
            mistakes: [
              "Half-committing to the character, which makes the wheel look ragged",
              "Assuming another school's version is wrong rather than different",
            ],
            drill: "Each call eight times in isolation before mixing them.",
          },
        ],
      },
    ],
  },
];

const GLOSSARY = [
  ["Casino", "The Cuban style of salsa danced socially in a circular pattern, in open hold."],
  ["Clave", "The five-stroke rhythmic key that organises Cuban music. Son and rumba versions differ by one stroke."],
  ["Guapea", "The casino basic step, danced in open hold with a back step."],
  ["Dile que no", "'Tell him no' — the cross-body transition that resolves most casino figures."],
  ["Enchufla", "The 'plug in' — a change of places in which the follower turns to face back."],
  ["Vacílala", "'Enjoy her' — a release allowing the follower to turn and style."],
  ["Exhíbela", "'Show her off' — the follower sent across in front under a raised hand."],
  ["Rueda de casino", "Casino danced in a circle to figures announced by a caller."],
  ["Dame", "'Give me' — the rueda call for a partner change."],
  ["A contratiempo", "Stepping on the offbeat, characteristic of son."],
  ["Sostenido", "A held, suspended moment in son that resolves late."],
  ["Montuno", "The repeating, call-and-response section of a son or salsa arrangement."],
  ["Timba", "Modern Cuban dance music, harder-edged and more sectional than classic salsa."],
  ["Bloque", "An ensemble hit or break in a timba arrangement."],
  ["Despelote", "Loose, hip-driven solo body movement from the timba era."],
  ["Guaguancó", "The couple form of Cuban rumba, containing the vacunao."],
  ["Vacunao", "The marked gesture of pursuit in guaguancó."],
  ["Botao", "The follower's block or deflection of the vacunao."],
  ["Yambú", "The slow, older rumba style played on cajones, without vacunao."],
  ["Columbia", "Fast solo rumba in 6/8, traditionally competitive."],
  ["Quinto", "The highest-pitched rumba drum, which converses with the dancer."],
  ["Guarapachangueo", "A modern approach to rumba percussion that redistributes the parts."],
  ["Batá", "The three double-headed drums used in Lucumí ceremony: iyá, itótele, okónkolo."],
  ["Toque", "A specific drum rhythm that calls a particular Orisha."],
  ["Orisha", "A deity of the Yoruba-derived Lucumí tradition in Cuba."],
  ["Iruke", "The horsetail whisk carried in the dance of Oyá."],
  ["Oché", "The double-headed axe associated with Changó."],
];

/* ---------- Demo accounts (replace with real auth) ---------- */
const MEMBERS = [
  { email: "member@salsasolent.co.uk", pin: "1959", name: "Member" },
  { email: "demo@salsasolent.co.uk", pin: "1959", name: "Demo" },
];

/* ---------- Helpers ---------- */
const ALL_LESSONS = CURRICULUM.flatMap((s) =>
  s.levels.flatMap((l) =>
    l.lessons.map((lesson, i) => ({
      ...lesson,
      strandId: s.id,
      strandName: s.name,
      accent: s.accent,
      levelId: l.id,
      levelName: l.name,
      indexInLevel: i,
      levelLength: l.lessons.length,
    }))
  )
);
const lessonById = (id) => ALL_LESSONS.find((l) => l.id === id);
const strandLessons = (sid) => ALL_LESSONS.filter((l) => l.strandId === sid);

/* ---------- Progress: watched, practised, and how fresh it still is ----------
   Marking a lesson practised sets when it comes back round. Ratings are about
   how the body felt, not whether you remembered it — "shaky" pulls the lesson
   back within days, "solid" pushes it out and stretches further each time it
   holds up. Nothing is ever completed; it just goes stale, which is what
   actually happens to a figure you have not danced in three months. */
const DAY = 86400000;
const INTERVALS = {
  shaky: [2, 3, 4, 5],
  getting: [7, 10, 14, 21],
  solid: [21, 35, 56, 90],
};
const RATINGS = [
  { id: "shaky", label: "Still shaky" },
  { id: "getting", label: "Getting there" },
  { id: "solid", label: "Solid" },
];

function statusOf(rec, now) {
  const t = now || Date.now();
  if (!rec || (!rec.watched && !rec.practisedAt)) return { key: "new", label: "Not started", mark: "" };
  if (!rec.practisedAt) return { key: "watched", label: "Watched, not practised", mark: "\u00b7" };
  const days = Math.ceil((rec.due - t) / DAY);
  if (days <= 0) return { key: "due", label: "Ready to revisit", mark: "\u21bb", days };
  return { key: "fresh", label: `Fresh — back in ${days} ${days === 1 ? "day" : "days"}`, mark: "\u2713", days };
}

const ago = (ts) => {
  const d = Math.floor((Date.now() - ts) / DAY);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
};

const countBy = (lessons, progress, test) =>
  lessons.filter((l) => test(progress[l.id], statusOf(progress[l.id]))).length;

const isPractised = (rec) => Boolean(rec && rec.practisedAt);
const dueLessons = (progress) =>
  ALL_LESSONS.filter((l) => statusOf(progress[l.id]).key === "due")
    .sort((a, b) => (progress[a.id].due || 0) - (progress[b.id].due || 0));

/* ---------- Fit: scale a line of text so it spans its container ----------
   Measures the rendered text at a reference size, then scales to the exact
   width available. Re-measures on resize and once the webfont has loaded,
   because Poppins and the fallback have very different metrics. */
function Fit({ children, min = 20, max = 120, className }) {
  const box = useRef(null);
  const line = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const fit = () => {
      const b = box.current, l = line.current;
      if (!b || !l) return;
      const avail = b.clientWidth;
      if (!avail) return;
      const prev = l.style.fontSize;
      l.style.fontSize = "100px";
      const w = l.getBoundingClientRect().width;
      l.style.fontSize = prev;
      if (!w) return;
      setSize(Math.max(min, Math.min(max, (avail / w) * 100)));
    };
    fit();
    let ro;
    if (typeof ResizeObserver !== "undefined" && box.current) {
      ro = new ResizeObserver(fit);
      ro.observe(box.current);
    }
    window.addEventListener("resize", fit);
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit).catch(() => {});
    }
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [children, min, max]);

  return (
    <span ref={box} className={`fit${className ? " " + className : ""}`}>
      <span ref={line} className="fit-line" style={size ? { fontSize: size + "px" } : undefined}>
        {children}
      </span>
    </span>
  );
}

/* ---------- Clave strip: the signature element ---------- */
function Clave({ pattern, accent, size = "md", animate = false, showLabel = false, showCounts = false }) {
  const c = CLAVES[pattern];
  const [tick, setTick] = useState(-1);

  useEffect(() => {
    if (!animate) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    const id = setInterval(() => {
      n = (n + 1) % (c.cells + 4);
      setTick(n);
    }, 125);
    return () => clearInterval(id);
  }, [animate, c.cells]);

  const spoken = c.hits.map((h) => c.counts[h]).join(", ");

  return (
    <div className={`clave clave-${size}`} role="img" aria-label={`${c.label}. Strokes fall on ${spoken}.`}>
      {showCounts && (
        <div className="clave-row clave-counts" aria-hidden="true">
          {Array.from({ length: c.cells }, (_, i) => {
            const beat = i + 1;
            return (
              <span key={beat} className={`cslot${beat === c.barTwo ? " bar2" : ""}`}>
                {c.counts[beat] && <em style={{ color: accent }}>{c.counts[beat]}</em>}
              </span>
            );
          })}
        </div>
      )}
      <div className="clave-row" aria-hidden="true">
        {Array.from({ length: c.cells }, (_, i) => {
          const beat = i + 1;
          const hit = c.hits.includes(beat);
          const lit = animate && tick === i;
          return (
            <span
              key={beat}
              className={`cell${hit ? " hit" : ""}${lit ? " lit" : ""}${beat === c.barTwo ? " bar2" : ""}`}
              style={hit ? { background: accent } : undefined}
            />
          );
        })}
      </div>
      {showLabel && <span className="clave-label">{c.label}</span>}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div>
          <span className="logomark" role="img" aria-label="Salsa Solent Dance Academy" />
          <p className="foot-tag">{BRAND.tagline}</p>
          <p>
            Course videos and notes are for enrolled Salsa Solent students only, and are not for
            sharing or redistribution.
          </p>
        </div>
        <div>
          <h4>Customer care</h4>
          <a href={BRAND.links.account}>My account</a>
          <a href={BRAND.links.membership}>Membership</a>
          <a href={BRAND.links.schedule}>Schedule</a>
          <a href={BRAND.links.contact}>Contact us</a>
          <a href={BRAND.links.terms}>Terms and conditions</a>
          <a href={BRAND.links.privacy}>Privacy policy</a>
        </div>
        <div>
          <h4>Company details</h4>
          <p>
            <strong>{BRAND.company.name}</strong>
            <br />
            Company number: {BRAND.company.number}
            <br />
            {BRAND.company.address}
          </p>
          <div className="socials">
            <a href={BRAND.links.facebook}>Facebook</a>
            <a href={BRAND.links.instagram}>Instagram</a>
            <a href={BRAND.links.youtube}>YouTube</a>
          </div>
        </div>
      </div>
      <p className="copyright">
          © {BRAND.established}–{BRAND.copyrightYear || new Date().getFullYear()} {BRAND.company.name.replace(" LIMITED", "")}.
          All rights reserved.
        </p>
    </footer>
  );
}

/* ---------- Public landing page ---------- */
function Landing({ onSignIn }) {
  const totals = CURRICULUM.map((c) => ({
    ...c,
    lessons: strandLessons(c.id).length,
    levelCount: c.levels.length,
  }));
  const all = ALL_LESSONS.length;
  const levels = CURRICULUM.reduce((n, c) => n + c.levels.length, 0);

  return (
    <div className="landing">
      <header className="land-hero">
        <span className="logomark" role="img" aria-label="Salsa Solent Dance Academy" />
        <p className="eyebrow">{BRAND.tagline}</p>
        <h1 className="fitted">
          <Fit max={96}>The course library</Fit>
        </h1>
        <p className="land-lede">
          Every figure we teach, in the order we teach it, on video. Yours for as long as you are
          dancing with us.
        </p>
        <div className="land-cta">
          <button className="btn primary" onClick={onSignIn}>Sign in</button>
          <a className="btn" href={BRAND.links.schedule}>I am new here</a>
        </div>
        <p className="land-note">For students currently enrolled in classes</p>
      </header>

      <section className="land-stats">
        <div><span className="ls-n">{all}</span><span className="ls-l">Lessons</span></div>
        <div><span className="ls-n">{CURRICULUM.length}</span><span className="ls-l">Courses</span></div>
        <div><span className="ls-n">{levels}</span><span className="ls-l">Levels</span></div>
        <div><span className="ls-n sm">Unlimited</span><span className="ls-l">Rewatches</span></div>
        <div><span className="ls-n sm">Still counting</span><span className="ls-l">Hours drilled</span></div>
      </section>

      <section className="land-section">
        <p className="eyebrow">What is inside</p>
        <h2 className="display">{all} lessons, {CURRICULUM.length} courses</h2>
        <p className="lede wide">
          Cuban dance, taught the way it is danced in Havana — starting with casino, then back to
          the traditions it grew out of.
        </p>
        <div className="land-grid">
          {totals.map((c) => (
            <div className="land-card" key={c.id}>
              <Clave pattern={c.clave} accent={c.accent} size="sm" />
              <h3>{c.name}</h3>
              <p className="spanish">
                {c.spanish}
                {c.tracks ? " · " + c.tracks.map((t) => t.name.toLowerCase()).join(" + ") : ""}
              </p>
              <p className="card-blurb">{c.blurb}</p>
              <p className="mono small" style={{ color: c.accent }}>
                {c.lessons} lessons{c.levelCount > 1 ? ` · ${c.levelCount} levels` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="land-section alt">
        <p className="eyebrow">How it works</p>
        <h2 className="display">Three steps</h2>
        <ol className="land-steps">
          <li>
            <span className="step-n">1</span>
            <div>
              <h3>Join a class</h3>
              <p>
                Book any course on the main site. No partner needed, and no experience either — most
                people arrive on their own and knowing nothing.
              </p>
            </div>
          </li>
          <li>
            <span className="step-n">2</span>
            <div>
              <h3>Get your access code</h3>
              <p>
                Your teacher hands it out in your first lesson. One code, one login, for as long as
                your membership runs.
              </p>
            </div>
          </li>
          <li>
            <span className="step-n">3</span>
            <div>
              <h3>Practise between classes</h3>
              <p>
                Every lesson has a video, the counts, what to work on, the mistakes to avoid, and one
                drill for the week. Work at your own pace.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="land-section">
        <div className="land-split">
          <div>
            <p className="eyebrow">What a lesson looks like</p>
            <h2 className="display">Not just a video</h2>
            <p className="lede">
              A video on its own tells you what a figure looks like. It does not tell you where the
              count falls, what your partner should be feeling, or why it keeps going wrong on the
              fifth beat. Every lesson in the library carries all of that in writing alongside the
              video, so you can read it on the bus and drill it in the kitchen.
            </p>
          </div>
          <ul className="land-list">
            <li>The timing, written out against the clave</li>
            <li>Three or four things to work on, in order</li>
            <li>The mistakes we correct most often in class</li>
            <li>One drill to take away for the week</li>
            <li>A glossary of every Spanish term we use</li>
            <li>Your own progress, saved as you go</li>
          </ul>
        </div>
      </section>

      <section className="land-band">
        <h2>More than a video library</h2>
        <p>
          Watch it on the bus, drill it in the kitchen, and turn up on Tuesday already knowing the
          figure.
        </p>
        <p className="band-sub">Join our Salsa Solent family</p>
        <div className="land-cta">
          <a className="btn navy" href={BRAND.links.book}>Book your class</a>
          <button className="btn outline-w" onClick={onSignIn}>Sign in</button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ---------- Sign in ---------- */
function SignIn({ onSignIn, onBack }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const attempt = () => {
    const m = MEMBERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.pin === pin.trim()
    );
    if (m) onSignIn(m);
    else setError("That email and access code don't match a current membership. Check with your teacher in class.");
  };

  return (
    <div className="signin">
      <div className="signin-inner">
        <button className="signin-back" onClick={onBack}>← Back</button>
        <div className="wordmark large">
          {BRAND.logo ? <span className="logomark" role="img" aria-label="Salsa Solent Dance Academy" /> : <span className="wm-1">Salsa Solent</span>}
          <span className="wm-2">{BRAND.tagline}</span>
        </div>
        <Clave pattern="son32" accent={BRAND.orange} size="lg" animate showLabel showCounts />
        <h2 className="display">welcome back to the family</h2>
        <p className="signin-lede">
          Your course library — every figure we teach, in order, with video. For students currently
          enrolled in classes.
        </p>
        <div className="field">
          <label htmlFor="em">Email</label>
          <input
            id="em"
            type="email"
            value={email}
            autoComplete="email"
            placeholder="you@example.com"
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
          />
        </div>
        <div className="field">
          <label htmlFor="pn">Access code</label>
          <input
            id="pn"
            type="password"
            value={pin}
            placeholder="Four digits"
            onChange={(e) => { setPin(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn primary wide" onClick={attempt}>Sign in</button>
        <p className="signin-foot">
          New here? Have a look at the{" "}
          <a href={BRAND.links.schedule}>class schedule</a> or our{" "}
          <a href={BRAND.links.membership}>membership options</a>. Access codes are handed out in
          your first lesson.
        </p>
        <div className="proto">
          <strong>Prototype note (delete before launch)</strong>
          Sign in with <code>member@salsasolent.co.uk</code> / <code>1959</code>. This gate runs in
          the browser and is not real security — see the handover notes.
        </div>
      </div>
    </div>
  );
}

/* ---------- Video slot ----------
   A lesson has either one video or a set of labelled clips (used where one
   lesson covers several named calls). Clips render as a tab strip over a
   single player, so a five-call lesson does not become five stacked boxes. */
function VideoSlot({ lesson }) {
  const clips = lesson.clips || [{ id: lesson.id, label: null, video: lesson.video }];
  const [i, setI] = useState(0);
  const clip = clips[Math.min(i, clips.length - 1)];

  return (
    <div className="video-block">
      {clips.length > 1 && (
        <div className="clips" role="tablist" aria-label="Clips in this lesson">
          {clips.map((c, n) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={n === i}
              className={`clip${n === i ? " on" : ""}`}
              style={n === i ? { borderBottomColor: lesson.accent, color: lesson.accent } : undefined}
              onClick={() => setI(n)}
            >
              <span className="clip-n mono">{String(n + 1).padStart(2, "0")}</span>
              {c.label}
            </button>
          ))}
        </div>
      )}
      {clip.video ? (
        <div className="video">
          <iframe
            src={clip.video}
            title={clip.label ? `${lesson.title} — ${clip.label}` : lesson.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="video empty" style={{ borderColor: lesson.accent }}>
          <div className="video-mark" style={{ background: lesson.accent }} />
          <p className="video-title">
            {clip.label ? `${clip.label} — not uploaded yet` : "Video not uploaded yet"}
          </p>
          <p className="video-sub">
            Add the embed URL to <code>video</code> on <code>{clip.id}</code>.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Lesson ---------- */
function LessonView({ lesson, progress, onWatch, onPractise, go }) {
  const siblings = ALL_LESSONS.filter((l) => l.levelId === lesson.levelId);
  const prev = siblings[lesson.indexInLevel - 1];
  const next = siblings[lesson.indexInLevel + 1];
  const rec = progress[lesson.id];
  const st = statusOf(rec);

  return (
    <article className="lesson">
      <button className="back" onClick={() => go({ type: "strand", id: lesson.strandId })}>
        ← {lesson.strandName} · {lesson.levelName}
      </button>

      <header className="lesson-head">
        <p className="eyebrow" style={{ color: lesson.accent }}>
          Lesson {lesson.indexInLevel + 1} of {lesson.levelLength}
        </p>
        <h1>{lesson.title}</h1>
        <div className="meta">
          <span className="mono">{lesson.timing}</span>
          <span className="dot" />
          <span className="mono">{lesson.duration}</span>
          {st.key !== "new" && (
            <>
              <span className="dot" />
              <span className={`chip chip-${st.key}`}>{st.label}</span>
            </>
          )}
        </div>
      </header>

      {lesson.note && (
        <div className="callout" style={{ borderColor: lesson.accent }}>
          {lesson.note}
        </div>
      )}

      <div className="lesson-grid">
        <div className="lesson-main">
          <VideoSlot key={lesson.id} lesson={lesson} />
          <p className="lede">{lesson.summary}</p>
          {lesson.attributes && (
            <dl className="attrs">
              {lesson.attributes.map((a) => (
                <div key={a.label}>
                  <dt>{a.label}</dt>
                  <dd>{a.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="drill" style={{ borderColor: lesson.accent }}>
            <h3>Practise this week</h3>
            <p>{lesson.drill}</p>
          </div>
        </div>

        <aside className="lesson-side">
          <section>
            <h3>{lesson.focusLabel || "What to work on"}</h3>
            <ul className="ticks">
              {lesson.focus.map((f, i) => (
                <li key={i}>
                  <span className="bullet" style={{ background: lesson.accent }} />
                  {f}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Common mistakes</h3>
            <ul className="crosses">
              {lesson.mistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <div className="marking">
        <div className="mark-col">
          <h3>Step one</h3>
          <button
            className={`watch-btn${rec && rec.watched ? " on" : ""}`}
            onClick={() => onWatch(lesson.id)}
            aria-pressed={Boolean(rec && rec.watched)}
          >
            <span className="watch-box">{rec && rec.watched ? "✓" : ""}</span>
            {rec && rec.watched ? "Watched and read" : "Mark as watched"}
          </button>
          <p className="mark-note">
            {rec && rec.watched
              ? "Now go and dance it. Watching is not practising."
              : "Tick this once you have seen the video and read the notes."}
          </p>
        </div>

        <div className="mark-col wide">
          <h3>Step two — how did it go?</h3>
          <div className="rate">
            {RATINGS.map((r) => (
              <button
                key={r.id}
                className={`rate-btn rate-${r.id}${rec && rec.rating === r.id ? " on" : ""}`}
                onClick={() => onPractise(lesson.id, r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <p className="mark-note">
            {isPractised(rec) ? (
              <>
                Practised {rec.reps} {rec.reps === 1 ? "time" : "times"}, last {ago(rec.practisedAt)}.{" "}
                {st.key === "due"
                  ? "It has gone stale — worth another go."
                  : `Back in your revisit list in ${st.days} ${st.days === 1 ? "day" : "days"}.`}
              </>
            ) : (
              "Tap one after you have actually drilled it. Be honest — shaky brings it back sooner, and that is the point."
            )}
          </p>
        </div>
      </div>

      <div className="lesson-foot">
        <div className="pager">
          {prev && (
            <button className="btn sm" onClick={() => go({ type: "lesson", id: prev.id })}>
              ← {prev.title}
            </button>
          )}
          {next && (
            <button className="btn sm" onClick={() => go({ type: "lesson", id: next.id })}>
              {next.title} →
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ---------- Strand ---------- */
function LessonRow({ lesson, n, progress, go, accent }) {
  const st = statusOf(progress[lesson.id]);
  return (
    <li>
      <button className="lesson-row" onClick={() => go({ type: "lesson", id: lesson.id })}>
        <span className="num mono">{n}</span>
        <span className="row-body">
          <span className="row-title">{lesson.title}</span>
          <span className="row-meta mono">
            {lesson.timing} · {lesson.duration}
          </span>
        </span>
        <span
          className={`pip pip-${st.key}`}
          title={st.label}
          style={st.key === "fresh" ? { background: accent, borderColor: accent } : undefined}
        >
          {st.mark}
        </span>
      </button>
    </li>
  );
}

function StrandView({ strand, progress, go }) {
  const tracks = strand.tracks;
  const [track, setTrack] = useState(tracks ? tracks[0].id : null);
  const levels = tracks ? strand.levels.filter((l) => l.track === track) : strand.levels;
  const trackName = tracks ? (tracks.find((t) => t.id === track) || {}).name.toLowerCase() : "";
  const ls = levels.flatMap((l) => l.lessons);
  const practised = countBy(ls, progress, (rec) => isPractised(rec));
  const due = countBy(ls, progress, (rec, st) => st.key === "due");

  return (
    <div className="strand">
      <header className="strand-head">
        <p className="eyebrow mono" style={{ color: strand.accent }}>
          {CLAVES[strand.clave].label}
        </p>
        <h1 className="display fitted">
          <Fit max={88}>{strand.name}</Fit>
        </h1>
        <p className="spanish">{strand.spanish}</p>
        <Clave pattern={strand.clave} accent={strand.accent} size="md" showCounts />
        <p className="lede wide">{strand.blurb}</p>
        <div className="bar">
          <div
            className="bar-fill"
            style={{ width: `${(practised / ls.length) * 100}%`, background: strand.accent }}
          />
        </div>
        <p className="mono small">
          {practised} of {ls.length} practised
          {tracks ? ` in ${trackName}` : ""}
          {due > 0 ? ` · ${due} ready to revisit` : ""}
        </p>
      </header>

      {tracks && (
        <div className="tracks" role="tablist" aria-label="Choose a track">
          {tracks.map((t) => {
            const tl = strand.levels.filter((l) => l.track === t.id).flatMap((l) => l.lessons);
            const tp = countBy(tl, progress, (rec) => isPractised(rec));
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={track === t.id}
                className={`track${track === t.id ? " on" : ""}`}
                style={track === t.id ? { borderBottomColor: strand.accent } : undefined}
                onClick={() => setTrack(t.id)}
              >
                <span className="track-n">{t.name}</span>
                <span className="track-note">{t.note}</span>
                <span className="track-count mono">{tp}/{tl.length} practised</span>
              </button>
            );
          })}
        </div>
      )}

      {levels.map((level) => (
        <section className="level" key={level.id}>
          <div className="level-head">
            <span className="rank mono" style={{ borderColor: strand.accent, color: strand.accent }}>
              {level.rank}
            </span>
            <h2>{level.name}</h2>
            <p>{level.summary}</p>
          </div>
          <ol className="lessons">
            {level.lessons.map((l, i) => (
              <LessonRow
                key={l.id}
                lesson={l}
                n={String(i + 1).padStart(2, "0")}
                progress={progress}
                go={go}
                accent={strand.accent}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({ progress, go }) {
  const total = ALL_LESSONS.length;
  const watched = countBy(ALL_LESSONS, progress, (rec) => rec && rec.watched);
  const practised = countBy(ALL_LESSONS, progress, (rec) => isPractised(rec));
  const solid = countBy(ALL_LESSONS, progress, (rec, st) => st.key === "fresh" && rec.rating === "solid");
  const due = dueLessons(progress);
  const nextUp = ALL_LESSONS.find((l) => !progress[l.id] || !progress[l.id].watched);

  return (
    <div className="dash">
      <section className="hero">
        <p className="eyebrow mono">{BRAND.tagline}</p>
        <h1 className="display fitted">
          <Fit max={110}>everything we teach,</Fit>
          <Fit max={110}>in the order we teach it</Fit>
        </h1>
        <div className="hero-clave">
          <Clave pattern="son32" accent={BRAND.orange} size="lg" animate showCounts />
          <p className="mono small">
            Son clave 3–2 · the pattern under almost everything in this library
          </p>
        </div>
        <div className="entry">
          <button className="btn primary" onClick={() => go({ type: "strand", id: "technique" })}>
            I am new here
          </button>
          <button className="btn" onClick={() => go({ type: "lesson", id: "cas-3-02" })}>
            I am addicted to dance
          </button>
        </div>
        <div className="stats">
          <div>
            <span className="stat mono">{total}</span>
            <span className="stat-l">lessons</span>
          </div>
          <div>
            <span className="stat mono">{watched}</span>
            <span className="stat-l">watched</span>
          </div>
          <div>
            <span className="stat mono">{practised}</span>
            <span className="stat-l">practised</span>
          </div>
          <div>
            <span className="stat mono">{solid}</span>
            <span className="stat-l">solid right now</span>
          </div>
        </div>
      </section>

      {due.length > 0 && (
        <section className="revisit">
          <div className="revisit-head">
            <p className="eyebrow">Ready to revisit</p>
            <h2 className="display">
              {due.length} {due.length === 1 ? "lesson has" : "lessons have"} gone stale
            </h2>
            <p className="lede wide">
              You practised these a while ago. Nothing is lost — they just want topping up.
            </p>
          </div>
          <ol className="lessons">
            {due.slice(0, 6).map((l) => (
              <li key={l.id}>
                <button className="lesson-row" onClick={() => go({ type: "lesson", id: l.id })}>
                  <span className="num mono" style={{ color: l.accent }}>
                    {l.strandName.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="row-body">
                    <span className="row-title">{l.title}</span>
                    <span className="row-meta mono">
                      {l.levelName} · last practised {ago(progress[l.id].practisedAt)}
                    </span>
                  </span>
                  <span className="pip pip-due">↻</span>
                </button>
              </li>
            ))}
          </ol>
          {due.length > 6 && (
            <p className="mono small">and {due.length - 6} more</p>
          )}
        </section>
      )}

      {nextUp && (
        <section
          className="nextup"
          onClick={() => go({ type: "lesson", id: nextUp.id })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && go({ type: "lesson", id: nextUp.id })}
        >
          <p className="eyebrow" style={{ color: nextUp.accent }}>
            {practised === 0 ? "Start here" : "Next new lesson"}
          </p>
          <h2>{nextUp.title}</h2>
          <p className="mono small">
            {nextUp.strandName} · {nextUp.levelName} · {nextUp.duration}
          </p>
        </section>
      )}

      <section className="strands">
        {CURRICULUM.map((s) => {
          const ls = strandLessons(s.id);
          const c = countBy(ls, progress, (rec) => isPractised(rec));
          return (
            <button className="strand-card" key={s.id} onClick={() => go({ type: "strand", id: s.id })}>
              <Clave pattern={s.clave} accent={s.accent} size="sm" />
              <h3>{s.name}</h3>
              <p className="spanish">
                {s.spanish}
                {s.tracks ? " · " + s.tracks.map((t) => t.name.toLowerCase()).join(" + ") : ""}
              </p>
              <p className="card-blurb">{s.blurb}</p>
              <div className="bar thin">
                <div className="bar-fill" style={{ width: `${(c / ls.length) * 100}%`, background: s.accent }} />
              </div>
              <span className="mono small">{c}/{ls.length} practised</span>
            </button>
          );
        })}
      </section>
    </div>
  );
}

/* ---------- Glossary ---------- */
function Glossary() {
  return (
    <div className="glossary">
      <h1 className="display">glossary</h1>
      <p className="lede wide">
        Terms you will hear in class. Spanish spellings follow common Cuban usage.
      </p>
      <dl>
        {GLOSSARY.map(([t, d]) => (
          <div key={t}>
            <dt>{t}</dt>
            <dd>{d}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- Search ---------- */
function Results({ query, go }) {
  const q = query.trim().toLowerCase();
  const hits = q.length < 2 ? [] : ALL_LESSONS.filter((l) =>
    (l.title + " " + l.summary + " " + l.focus.join(" ") + " " + l.strandName).toLowerCase().includes(q)
  );
  return (
    <div className="results">
      <h1 className="display">{q.length < 2 ? "search" : `${hits.length} ${hits.length === 1 ? "result" : "results"}`}</h1>
      {q.length < 2 && (
        <p className="lede wide">
          Search by figure name, rhythm, level or Orisha — try “setenta”, “clave”, “vacunao” or
          “Yemayá”.
        </p>
      )}
      {q.length >= 2 && hits.length === 0 && (
        <p className="lede wide">
          Nothing matches “{query}”. Try a figure name, a rhythm, or an Orisha.
        </p>
      )}
      <ol className="lessons">
        {hits.map((l) => (
          <li key={l.id}>
            <button className="lesson-row" onClick={() => go({ type: "lesson", id: l.id })}>
              <span className="num mono" style={{ color: l.accent }}>
                {l.strandName.slice(0, 3).toUpperCase()}
              </span>
              <span className="row-body">
                <span className="row-title">{l.title}</span>
                <span className="row-meta mono">{l.levelName} · {l.duration}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- App ---------- */
/* ---------- Persistence ----------
   Artifacts cannot use browser storage; a deployed build can. Progress and
   sign-in survive a refresh. Wrapped in try/catch because Safari private
   browsing throws on localStorage access rather than returning null. */
const STORE_KEY = "salsa-solent-library-v1";

function loadStore() {
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveStore(data) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — the app still works, it just forgets */
  }
}

export default function App() {
  const [user, setUser] = useState(() => loadStore().user || null);
  const [view, setView] = useState({ type: "dash" });
  const [progress, setProgress] = useState(() => loadStore().progress || {});
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [publicView, setPublicView] = useState("landing");

  useEffect(() => {
    saveStore({ user, progress });
  }, [user, progress]);

  const go = (v) => { setView(v); setSearching(false); setQuery(""); window.scrollTo(0, 0); };
  const onWatch = (id) =>
    setProgress((p) => ({ ...p, [id]: { ...(p[id] || {}), watched: !(p[id] && p[id].watched) } }));

  const onPractise = (id, rating) =>
    setProgress((p) => {
      const rec = p[id] || {};
      const idx = Math.min(Math.max(rec.step || 0, 0), 3);
      // "Shaky" always comes back fast, however long the previous run of
      // successes was — a figure that fell apart tonight needs it soon.
      const days = INTERVALS[rating][rating === "shaky" ? 0 : idx];
      return {
        ...p,
        [id]: {
          ...rec,
          watched: true,
          rating,
          reps: (rec.reps || 0) + 1,
          step: rating === "shaky" ? 0 : Math.min(idx + 1, 3),
          practisedAt: Date.now(),
          due: Date.now() + days * DAY,
        },
      };
    });

  const styles = <style>{CSS}</style>;

  if (!user)
    return (
      <div className="app">
        {styles}
        {publicView === "landing" ? (
          <Landing onSignIn={() => setPublicView("signin")} />
        ) : (
          <SignIn onSignIn={setUser} onBack={() => setPublicView("landing")} />
        )}
      </div>
    );

  const strand = view.type === "strand" ? CURRICULUM.find((s) => s.id === view.id) : null;
  const lesson = view.type === "lesson" ? lessonById(view.id) : null;

  return (
    <div className="app">
      {styles}
      <header className="topbar">
        <div className="bar-inner">
          <button className="wordmark" onClick={() => go({ type: "dash" })}>
            {BRAND.logo ? <span className="logomark" role="img" aria-label="Salsa Solent Dance Academy" /> : <span className="wm-1">Salsa Solent</span>}
            <span className="wm-2">{BRAND.tagline}</span>
          </button>
          <div className="topbar-right">
            {searching ? (
              <input
                className="search"
                autoFocus
                value={query}
                placeholder="Search lessons"
                onChange={(e) => { setQuery(e.target.value); setView({ type: "search" }); }}
                onBlur={() => { if (!query) setSearching(false); }}
              />
            ) : (
              <button className="btn ghost sm" onClick={() => { setSearching(true); setView({ type: "search" }); }}>
                Search
              </button>
            )}
            <button className="btn ghost sm" onClick={() => go({ type: "glossary" })}>Glossary</button>
            <a className="btn ghost sm" href={BRAND.links.account}>My account</a>
            <span className="mono small hide-sm">
              {countBy(ALL_LESSONS, progress, (rec) => isPractised(rec))}/{ALL_LESSONS.length} practised
            </span>
            <button className="btn ghost sm" onClick={() => { setUser(null); setView({ type: "dash" }); }}>
              Sign out
            </button>
        </div>
        </div>
      </header>

      <nav className="strandnav">
        <div className="bar-inner nav-inner">
          {CURRICULUM.map((s) => (
            <button
              key={s.id}
              className={`snav${view.type === "strand" && view.id === s.id ? " on" : ""}${lesson && lesson.strandId === s.id ? " on" : ""}`}
              style={{ borderColor: (view.id === s.id || (lesson && lesson.strandId === s.id)) ? s.accent : "transparent" }}
              onClick={() => go({ type: "strand", id: s.id })}
            >
              {s.name}
            </button>
          ))}

        </div>
      </nav>

      <main>
        {view.type === "dash" && <Dashboard progress={progress} go={go} />}
        {strand && <StrandView key={strand.id} strand={strand} progress={progress} go={go} />}
        {lesson && <LessonView lesson={lesson} progress={progress} onWatch={onWatch} onPractise={onPractise} go={go} />}
        {view.type === "glossary" && <Glossary />}
        {view.type === "search" && <Results query={query} go={go} />}
      </main>

      <SiteFooter />
    </div>
  );
}

/* ---------- Logo (white script mark, used as a tintable CSS mask) ---------- */
const LOGO_MASK = "data:image/png;base64,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";

/* ---------- Styles ---------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.app {
  --navy: ${BRAND.navy};
  --navy-deep: ${BRAND.navyDeep};
  --orange: ${BRAND.orange};
  --orange-deep: ${BRAND.orangeDeep};
  --text: ${BRAND.text};
  --surface: ${BRAND.surface};
  --white: ${BRAND.white};
  --rule: #D9E4EF;
  --dim: #6B8CAD;
  --f: ${BRAND.font}, system-ui, sans-serif;
  --wrap: 1180px;
  --f-mono: 'IBM Plex Mono', ui-monospace, monospace;
  --logo: url("${LOGO_MASK}");
  background: var(--white);
  color: var(--text);
  overflow-x: clip;
  font-family: var(--f);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.75;
  min-height: 100vh;
}
.app *, .app *::before, .app *::after { box-sizing: border-box; }
.app button { font-family: inherit; color: inherit; }
.app a { color: var(--navy); text-decoration: none; border-bottom: 1px solid var(--rule); }
.app a:hover { border-bottom-color: var(--orange); }
.mono { font-family: var(--f-mono); font-variant-numeric: tabular-nums; }
.small { font-size: 12px; letter-spacing: 0.05em; color: var(--dim); }
.eyebrow { font-family: var(--f); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; color: var(--dim); margin: 0 0 14px; }

/* House style from salsasolent.com: headings are uppercase, heavy, widely tracked. */
.app h1, .app h2 { font-family: var(--f); font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; line-height: 1.18; color: var(--navy); }
.app h1 { font-size: clamp(26px, 4.4vw, 46px); margin: 0 0 18px; }
.app h2 { font-size: clamp(19px, 2.6vw, 28px); margin: 0 0 10px; }
.display { color: var(--orange); }
.fit { display: block; width: 100%; }
.fit-line { display: inline-block; white-space: nowrap; line-height: 1.06; }
.fitted { display: block; }
.fitted .fit + .fit { margin-top: 0.04em; }
.app h3 { font-family: var(--f); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--navy); margin: 0 0 14px; }
.app h4 { font-family: var(--f); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--white); margin: 0 0 16px; }

.lede { font-size: 17px; line-height: 1.8; color: var(--text); margin: 0 0 22px; font-weight: 400; }
.lede.wide { max-width: 62ch; }
.spanish { font-style: italic; color: var(--dim); margin: 0 0 18px; }

/* clave — the one signature element */
.clave { display: flex; flex-direction: column; gap: 8px; }
.clave-row { display: flex; gap: 3px; }
.clave .cell { display: block; border-radius: 2px; background: var(--rule); transition: transform .12s ease, opacity .12s ease; }
.clave-sm .cell { width: 8px; height: 14px; }
.clave-md .cell { width: 12px; height: 22px; }
.clave-lg .cell { width: 16px; height: 40px; }
.clave .cell.lit { opacity: .5; transform: scaleY(1.2); }
.clave-label { font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim); }
.clave-counts { align-items: flex-end; margin-bottom: 2px; }
.cslot { flex: 0 0 auto; position: relative; height: 15px; }
.clave-sm .cslot { width: 8px; }
.clave-md .cslot { width: 12px; }
.clave-lg .cslot { width: 16px; }
.cslot em { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); font-style: normal;
  font-family: var(--f-mono); font-weight: 500; font-size: 11px; line-height: 1; white-space: nowrap; }
.clave-lg .cslot em { font-size: 13px; }
/* gap marks where bar two begins, so the 3-side and 2-side read apart */
.cell.bar2, .cslot.bar2 { margin-left: 11px; }
.hero .clave .cell { background: rgba(255,255,255,0.22); }
.hero .clave-label { color: rgba(255,255,255,0.7); }

/* sign in — mirrors the main site's navy hero */
.signin { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 22px; background: var(--navy); }
.signin-inner { width: 100%; max-width: 460px; background: var(--white); padding: 44px 40px; border-radius: 4px; box-shadow: 0 18px 50px rgba(6,32,58,0.35); }
.signin .clave { margin: 20px 0 28px; }
.signin h2 { margin-bottom: 12px; }
.signin-lede { color: var(--text); margin: 0 0 30px; font-size: 15px; }
.wordmark { display: flex; flex-direction: column; align-items: flex-start; background: none; border: 0; padding: 0; cursor: pointer; text-align: left; }
.logomark { display: block; width: 128px; height: 108px; background-color: var(--white);
  -webkit-mask-image: var(--logo); mask-image: var(--logo);
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center; }
.topbar .logomark { width: 62px; height: 52px; }
.topbar .wm-2 { display: none; }
.signin .logomark { width: 168px; height: 142px; background-color: var(--navy); margin-bottom: 4px; }
.foot .logomark { width: 92px; height: 78px; background-color: rgba(255,255,255,0.9); margin-bottom: 16px; }
.wm-1 { font-family: var(--f); font-weight: 700; font-size: 20px; letter-spacing: 0.02em; line-height: 1; color: var(--white); }
.wm-2 { font-family: var(--f); font-weight: 600; font-size: 8.5px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--orange); margin-top: 6px; }
.signin .wm-1 { color: var(--navy); font-size: clamp(26px, 7vw, 36px); }
.signin .wm-2 { font-size: 11px; }
/* Sign-in header block is centred; the form below stays left-aligned so
   labels and inputs read normally. */
.signin .wordmark { align-items: center; width: 100%; }
.signin .logomark { margin-left: auto; margin-right: auto; }
.signin .wm-2, .signin h2, .signin-lede { text-align: center; }
.signin .clave { align-items: center; }
.field { margin-bottom: 18px; }
.field label { display: block; font-weight: 600; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--navy); margin-bottom: 8px; }
.field input, .search {
  width: 100%; background: var(--white); border: 1px solid var(--rule); color: var(--text);
  padding: 13px 15px; font-family: var(--f); font-size: 15px; border-radius: 3px;
}
.field input:focus, .search:focus { outline: 2px solid var(--orange); outline-offset: 1px; }
.error { color: #C0392B; font-size: 14px; margin: 0 0 14px; }
.signin-foot { color: var(--dim); font-size: 13px; margin: 22px 0 0; line-height: 1.7; }
.proto { margin-top: 26px; border-left: 3px solid var(--orange); background: var(--surface); padding: 14px 16px; font-size: 13px; color: var(--text); }
.proto strong { display: block; font-weight: 700; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; color: var(--orange); }
.app code { font-family: var(--f-mono); font-size: 0.85em; background: var(--surface); padding: 2px 6px; border-radius: 3px; }

/* buttons — solid orange, white uppercase, as on the main site */
.btn { display: inline-block; border: 2px solid var(--navy); background: transparent; color: var(--navy);
  padding: 12px 24px; font-family: var(--f); font-size: 13px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; cursor: pointer; border-radius: 3px; transition: background .15s, color .15s, border-color .15s; }
.btn:hover { background: var(--navy); color: var(--white); }
.btn:focus-visible { outline: 3px solid var(--orange); outline-offset: 2px; }
.btn.primary { background: var(--orange); border-color: var(--orange); color: var(--white); }
.btn.primary:hover { background: var(--orange-deep); border-color: var(--orange-deep); }
.btn.wide { width: 100%; }
.btn.sm { padding: 8px 14px; font-size: 11px; letter-spacing: 0.12em; border-width: 1px; }
a.btn { border-bottom: 2px solid var(--navy); }
.hero .btn { border-color: var(--white); color: var(--white); }
.hero .btn:hover { background: var(--white); color: var(--navy); }
.hero .btn.primary { border-color: var(--orange); color: var(--white); }
.hero .btn.primary:hover { background: var(--orange-deep); color: var(--white); }

/* chrome */
.topbar { background: var(--navy); }
.bar-inner { max-width: var(--wrap); margin: 0 auto; padding: 16px 24px; display: flex; align-items: center;
  justify-content: space-between; gap: 16px; flex-wrap: wrap; }
/* Header runs the full width: logo hard left, controls hard right. */
.topbar .bar-inner { max-width: none; padding: 16px 32px; }
/* Course names sit centred in the page. */
.nav-inner { padding: 0 24px; gap: 2px; justify-content: center; flex-wrap: nowrap; overflow-x: auto; }
.topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.topbar .btn { border-color: rgba(255,255,255,0.4); color: var(--white); }
.topbar .btn:hover { background: var(--white); color: var(--navy); }
.topbar a.btn { border-bottom-color: rgba(255,255,255,0.4); }
.topbar .small { color: rgba(255,255,255,0.75); }
.search { width: 190px; padding: 8px 12px; font-size: 13px; }
.strandnav { background: var(--surface); border-bottom: 1px solid var(--rule); }
.snav { background: none; border: 0; border-bottom: 3px solid transparent; padding: 15px 16px; font-family: var(--f);
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--dim); cursor: pointer; white-space: nowrap; }
.snav:hover, .snav.on { color: var(--navy); }
main { max-width: var(--wrap); margin: 0 auto; padding: 52px 24px 84px; }

/* dashboard hero — navy block with the main site's angled bottom edge */
.hero { background: var(--navy); color: var(--white); width: 100vw; margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw); margin-top: -52px; margin-bottom: 48px; padding: 64px 24px 104px;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%); }
.app .hero > * { max-width: calc(var(--wrap) - 48px); margin-left: auto; margin-right: auto; }
.hero h1 { color: var(--white); }
.hero .eyebrow { color: var(--orange); }
.hero-clave { margin: 30px auto 32px; }
.hero-clave .clave { margin-bottom: 10px; }
.hero-clave .small { color: rgba(255,255,255,0.7); }
.entry { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
.stats { display: flex; gap: 48px; flex-wrap: wrap; }
.stat { display: block; font-family: var(--f); font-weight: 800; font-size: 32px; color: var(--orange); line-height: 1.2; }
.stat-l { font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: rgba(255,255,255,0.75); }

.nextup { display: block; width: 100%; text-align: left; background: var(--surface); border: 1px solid var(--rule);
  border-left: 4px solid var(--orange); padding: 26px; margin-bottom: 46px; cursor: pointer; border-radius: 3px; }
.nextup:hover { background: var(--white); box-shadow: 0 6px 20px rgba(15,78,140,0.1); }
.strands { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
.strand-card { text-align: left; background: var(--white); border: 1px solid var(--rule); padding: 26px; cursor: pointer;
  border-radius: 3px; display: flex; flex-direction: column; transition: box-shadow .18s, transform .18s; }
.strand-card:hover { box-shadow: 0 10px 30px rgba(15,78,140,0.14); transform: translateY(-2px); }
.strand-card .clave { margin-bottom: 20px; }
.strand-card h3 { font-size: 17px; letter-spacing: 0.1em; margin: 0 0 6px; }
.card-blurb { font-size: 14.5px; line-height: 1.7; color: var(--text); margin: 0 0 20px; flex: 1; }

/* bars */
.bar { height: 5px; background: var(--rule); margin: 8px 0; border-radius: 3px; overflow: hidden; }
.bar.thin { height: 4px; }
.bar-fill { height: 100%; transition: width .3s ease; }

.tracks { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 44px; }
.track { text-align: left; background: var(--white); border: 1px solid var(--rule); border-bottom: 4px solid var(--rule);
  padding: 18px 20px; cursor: pointer; border-radius: 3px; display: flex; flex-direction: column; gap: 4px;
  transition: background .15s, border-color .15s; }
.track:hover { background: var(--surface); }
.track.on { background: var(--surface); }
.track-n { font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--navy); }
.track-note { font-size: 14px; color: var(--dim); }
.track-count { font-size: 11px; letter-spacing: 0.06em; color: var(--dim); margin-top: 4px; }

/* course page */
.strand-head { margin-bottom: 52px; }
.strand-head .clave { margin: 0 0 24px; }
.level { margin-bottom: 54px; }
.level-head { border-top: 2px solid var(--rule); padding-top: 26px; margin-bottom: 14px; }
.rank { display: inline-block; border: 1px solid; padding: 5px 11px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 14px; border-radius: 3px; }
.level-head p { color: var(--dim); margin: 0; font-size: 15px; }
.lessons { list-style: none; margin: 0; padding: 0; }
.lesson-row { display: flex; align-items: center; gap: 18px; width: 100%; text-align: left; background: none; border: 0;
  border-bottom: 1px solid var(--rule); padding: 18px 10px; cursor: pointer; transition: background .12s; }
.lesson-row:hover { background: var(--surface); }
.num { font-size: 12px; font-weight: 600; color: var(--dim); min-width: 38px; letter-spacing: 0.1em; }
.row-body { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.row-title { font-weight: 600; font-size: 16px; color: var(--navy); line-height: 1.45; }
.row-meta { font-size: 11px; color: var(--dim); letter-spacing: 0.05em; }
.state { width: 24px; height: 24px; border: 2px solid var(--rule); border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 13px; color: var(--white); flex-shrink: 0; }

/* lesson */
.back { background: none; border: 0; padding: 0 0 26px; font-weight: 700; font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--dim); cursor: pointer; }
.back:hover { color: var(--orange); }
.lesson-head { margin-bottom: 28px; }
.lesson-head h1 { text-transform: none; letter-spacing: 0.01em; font-weight: 700; font-size: clamp(24px, 3.8vw, 40px); }
.meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--dim); letter-spacing: 0.06em; }
.dot { width: 3px; height: 3px; background: var(--dim); border-radius: 50%; }
.callout { border-left: 4px solid; background: var(--surface); padding: 16px 20px; margin-bottom: 28px; font-size: 15px; }
.lesson-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 46px; align-items: start; }
.video-block { margin-bottom: 28px; }
.clips { display: flex; gap: 2px; overflow-x: auto; border-bottom: 1px solid var(--rule); margin-bottom: 14px; }
.clip { background: none; border: 0; border-bottom: 3px solid transparent; padding: 10px 14px; cursor: pointer;
  font-family: var(--f); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--dim); white-space: nowrap; display: flex; align-items: center; gap: 8px; }
.clip:hover { color: var(--navy); }
.clip-n { font-size: 10px; opacity: 0.65; font-weight: 400; }
.video { position: relative; aspect-ratio: 16 / 9; background: var(--surface); border-radius: 3px; overflow: hidden; }
.video iframe { width: 100%; height: 100%; border: 0; }
.video.empty { border: 2px dashed; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; }
.video-mark { width: 34px; height: 34px; border-radius: 50%; margin-bottom: 14px; }
.video-title { font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--navy); margin: 0 0 8px; }
.video-sub { font-size: 13px; color: var(--dim); margin: 0; }
.drill { border-left: 4px solid; padding: 18px 20px; background: var(--surface); }
.drill p { margin: 0; font-size: 15.5px; }
.lesson-side section { margin-bottom: 36px; }
.ticks, .crosses { list-style: none; margin: 0; padding: 0; }
.ticks li { position: relative; padding-left: 22px; margin-bottom: 14px; font-size: 15px; line-height: 1.65; }
.bullet { position: absolute; left: 0; top: 10px; width: 8px; height: 8px; border-radius: 50%; }
.crosses li { padding-left: 22px; margin-bottom: 14px; font-size: 15px; line-height: 1.65; color: var(--text); position: relative; }
.crosses li::before { content: "\u00d7"; position: absolute; left: 3px; top: -2px; color: #C0392B; font-size: 18px; font-weight: 700; }
.lesson-foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
  border-top: 2px solid var(--rule); margin-top: 46px; padding-top: 28px; }
.pager { display: flex; gap: 10px; flex-wrap: wrap; }

.attrs { margin: 0 0 26px; border-top: 2px solid var(--rule); }
.attrs > div { display: grid; grid-template-columns: 130px 1fr; gap: 18px; border-bottom: 1px solid var(--rule); padding: 11px 0; }
.attrs dt { font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--dim); padding-top: 3px; }
.attrs dd { margin: 0; font-size: 15px; line-height: 1.6; }

/* progress marking */
.chip { font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
  padding: 4px 9px; border-radius: 3px; }
.chip-watched { background: var(--surface); color: var(--dim); }
.chip-fresh { background: rgba(15,78,140,0.1); color: var(--navy); }
.chip-due { background: var(--orange); color: var(--white); }

.pip { width: 26px; height: 26px; border: 2px solid var(--rule); border-radius: 50%; display: flex;
  align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0;
  color: var(--white); line-height: 1; }
.pip-new { color: transparent; }
.pip-watched { color: var(--dim); border-color: var(--dim); font-size: 20px; }
.pip-fresh { color: var(--white); }
.pip-due { background: var(--orange); border-color: var(--orange); color: var(--white); }

.marking { display: grid; grid-template-columns: 1fr 1.4fr; gap: 32px; margin-top: 46px;
  padding: 28px; background: var(--surface); border-top: 3px solid var(--orange); border-radius: 0 0 3px 3px; }
.mark-col h3 { margin-bottom: 14px; }
.watch-btn { display: flex; align-items: center; gap: 12px; width: 100%; background: var(--white);
  border: 2px solid var(--rule); padding: 14px 16px; cursor: pointer; border-radius: 3px;
  font-family: var(--f); font-weight: 700; font-size: 13px; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--navy); text-align: left; transition: border-color .15s; }
.watch-btn:hover { border-color: var(--navy); }
.watch-btn.on { border-color: var(--navy); background: var(--navy); color: var(--white); }
.watch-box { flex: 0 0 auto; width: 22px; height: 22px; border: 2px solid var(--rule); border-radius: 3px;
  display: flex; align-items: center; justify-content: center; font-size: 14px; background: var(--white); color: var(--navy); }
.watch-btn.on .watch-box { border-color: var(--white); }
.rate { display: flex; gap: 10px; flex-wrap: wrap; }
.rate-btn { flex: 1; min-width: 120px; background: var(--white); border: 2px solid var(--rule);
  padding: 14px 12px; cursor: pointer; border-radius: 3px; font-family: var(--f); font-weight: 700;
  font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--navy); transition: all .15s; }
.rate-btn:hover { border-color: var(--navy); }
.rate-shaky.on { background: #C0392B; border-color: #C0392B; color: var(--white); }
.rate-getting.on { background: var(--orange); border-color: var(--orange); color: var(--white); }
.rate-solid.on { background: var(--navy); border-color: var(--navy); color: var(--white); }
.mark-note { font-size: 13.5px; line-height: 1.7; color: var(--dim); margin: 14px 0 0; }

.revisit { border: 1px solid var(--rule); border-left: 4px solid var(--orange); background: var(--surface);
  padding: 30px; margin-bottom: 46px; border-radius: 0 3px 3px 0; }
.revisit-head { margin-bottom: 8px; }
.revisit .eyebrow { color: var(--orange); }
.revisit .lede { font-size: 15px; margin-bottom: 18px; }
.revisit .lesson-row { padding: 14px 0; }
.revisit .lesson-row:hover { background: var(--white); }
.revisit .mono.small { margin: 14px 0 0; }

/* glossary */
.glossary dl { margin: 30px 0 0; }
.glossary dl > div { display: grid; grid-template-columns: 220px 1fr; gap: 26px; border-top: 1px solid var(--rule); padding: 18px 0; }
.glossary dt { font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--navy); }
.glossary dd { margin: 0; font-size: 15px; }

/* public landing page */
.landing { background: var(--white); }
.land-hero { background: var(--navy); color: var(--white); text-align: center; padding: 72px 24px 104px;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%); }
.app .land-hero > * { max-width: calc(var(--wrap) - 48px); margin-left: auto; margin-right: auto; }
.app .land-band > * { max-width: calc(var(--wrap) - 48px); margin-left: auto; margin-right: auto; }
.land-hero .logomark { width: 190px; height: 160px; margin: 0 auto 22px; }
.land-hero .eyebrow { color: var(--orange); }
.land-hero h1 { color: var(--white); font-size: clamp(32px, 6vw, 60px); margin-bottom: 20px; }
.land-lede { max-width: 52ch; margin: 0 auto 34px; font-size: 18px; line-height: 1.75; color: rgba(255,255,255,0.88); }
.land-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.land-hero .btn { border-color: rgba(255,255,255,0.6); color: var(--white); }
.land-hero .btn:hover { background: var(--white); color: var(--navy); }
.land-hero .btn.primary { border-color: var(--orange); }
.land-hero .btn.primary:hover { background: var(--orange-deep); border-color: var(--orange-deep); color: var(--white); }
.land-note { font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(255,255,255,0.55); margin: 24px 0 0; }

.land-section { max-width: var(--wrap); margin: 0 auto; padding: 64px 24px; }
.land-section.alt { max-width: none; background: var(--surface); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
.land-section.alt > * { max-width: calc(var(--wrap) - 48px); margin-left: auto; margin-right: auto; }
.land-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 34px; }
.land-card { background: var(--white); border: 1px solid var(--rule); border-top: 3px solid var(--orange); padding: 26px; border-radius: 0 0 3px 3px; }
.land-card .clave { margin-bottom: 18px; }
.land-card h3 { font-size: 16px; letter-spacing: 0.1em; margin: 0 0 4px; }
.land-card .spanish { margin-bottom: 14px; font-size: 14px; }
.land-card .card-blurb { margin-bottom: 16px; }

.land-steps { list-style: none; margin: 34px 0 0; padding: 0; display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
.land-steps li { display: flex; gap: 18px; align-items: flex-start; }
.step-n { flex: 0 0 auto; width: 42px; height: 42px; border-radius: 50%; background: var(--orange);
  color: var(--white); font-weight: 800; font-size: 17px; display: flex; align-items: center; justify-content: center; }
.land-steps h3 { margin-bottom: 8px; font-size: 14px; }
.land-steps p { margin: 0; font-size: 15px; line-height: 1.7; }

.land-split { display: grid; grid-template-columns: 1.25fr 1fr; gap: 52px; align-items: start; }
.land-list { list-style: none; margin: 0; padding: 0; border-top: 2px solid var(--rule); }
.land-list li { border-bottom: 1px solid var(--rule); padding: 14px 0 14px 26px; position: relative; font-size: 15px; }
.land-list li::before { content: ""; position: absolute; left: 0; top: 21px; width: 9px; height: 9px;
  border-radius: 50%; background: var(--orange); }

/* stats row — navy figure, orange label, as on the main site */
.land-stats { max-width: var(--wrap); margin: 0 auto; padding: 56px 24px 8px; display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 32px 20px; text-align: center; }
.ls-n { display: block; font-weight: 800; font-size: clamp(28px, 3.6vw, 40px); line-height: 1.1;
  color: var(--navy); letter-spacing: -0.01em; }
.ls-n.sm { font-size: clamp(15px, 1.6vw, 17px); text-transform: uppercase; letter-spacing: 0.04em; padding-top: 12px; }
.ls-l { display: block; margin-top: 8px; font-weight: 700; font-size: 12px; text-transform: uppercase;
  letter-spacing: 0.16em; color: var(--orange); }

/* full-bleed orange band with a navy button */
.land-band { background: var(--orange); color: var(--white); text-align: center; padding: 76px 24px; }
.land-band h2 { color: var(--white); margin-bottom: 26px; }
.land-band p { max-width: 46ch; margin: 0 auto 22px; font-weight: 600; font-size: 16px; line-height: 1.8; }
.band-sub { font-weight: 700 !important; text-transform: uppercase; letter-spacing: 0.22em;
  font-size: 14px !important; margin-bottom: 32px !important; }
.btn.navy { background: var(--navy); border-color: var(--navy); color: var(--white); }
.btn.navy:hover { background: var(--navy-deep); border-color: var(--navy-deep); color: var(--white); }
a.btn.navy { border-bottom-color: var(--navy); }
.btn.outline-w { border-color: var(--white); color: var(--white); }
.btn.outline-w:hover { background: var(--white); color: var(--orange-deep); }
.landing .foot { clip-path: none; margin-top: 0; }

.signin-back { background: none; border: 0; padding: 0 0 20px; font-weight: 700; font-size: 11px;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim); cursor: pointer; }
.signin-back:hover { color: var(--orange); }

/* footer */
.foot { background: var(--navy-deep); color: rgba(255,255,255,0.8); padding: 52px 24px 40px;
  clip-path: polygon(0 44px, 100% 0, 100% 100%, 0 100%); margin-top: 40px; }
.foot-grid { max-width: var(--wrap); margin: 0 auto; display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 44px; }
.foot p { margin: 0 0 10px; font-size: 13px; color: rgba(255,255,255,0.72); line-height: 1.7; }
.foot strong { color: var(--white); }
.foot .clave .cell { background: rgba(255,255,255,0.2); }
.foot .logomark + .foot-tag { margin-top: 0 !important; }
.foot-tag { font-weight: 700; text-transform: uppercase; letter-spacing: 0.22em; font-size: 10px;
  color: var(--orange) !important; margin: 18px 0 14px !important; }
.foot a { display: block; font-size: 13px; color: rgba(255,255,255,0.72); border: 0; margin-bottom: 8px; }
.foot a:hover { color: var(--orange); }
.socials { display: flex; gap: 18px; margin-top: 14px; }
.socials a { margin: 0; }
.copyright { max-width: var(--wrap); margin: 36px auto 0 !important; padding-top: 22px;
  border-top: 1px solid rgba(255,255,255,0.15); font-size: 12px; }

@media (max-width: 900px) { .foot-grid { grid-template-columns: 1fr 1fr; } .land-split { grid-template-columns: 1fr; gap: 34px; } }
@media (max-width: 820px) {
  .lesson-grid { grid-template-columns: 1fr; gap: 32px; }
  .glossary dl > div { grid-template-columns: 1fr; gap: 6px; }
  .foot-grid { grid-template-columns: 1fr; gap: 32px; }
  .hide-sm { display: none; }
  main { padding: 36px 18px 60px; }
  .hero { margin-top: -36px; margin-bottom: 40px; padding: 44px 18px 78px; }
  .bar-inner { padding: 14px 18px; }
  .topbar .bar-inner { padding: 14px 18px; }
  .nav-inner { padding: 0 18px; justify-content: flex-start; }
  .signin-inner { padding: 32px 24px; }
  .clave-lg .cell { width: 11px; height: 30px; }
  .entry .btn { flex: 1; text-align: center; }
  .land-hero { padding: 48px 20px 76px; }
  .land-hero .logomark { width: 140px; height: 118px; }
  .land-section { padding: 46px 20px; }
  .land-stats { padding: 40px 20px 4px; gap: 26px 16px; }
  .land-band { padding: 52px 20px; }
  .tracks { grid-template-columns: 1fr; gap: 10px; }
  .marking { grid-template-columns: 1fr; gap: 26px; padding: 22px; }
  .revisit { padding: 22px; }
  .attrs > div { grid-template-columns: 1fr; gap: 2px; }
}
@media (prefers-reduced-motion: reduce) {
  .app *, .app *::before, .app *::after { transition: none !important; animation: none !important; }
}
`;
