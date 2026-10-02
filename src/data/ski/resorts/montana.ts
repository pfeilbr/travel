import type { Resort } from '../types';

const ASOF = '2026-10-02';

const resorts: Resort[] = [
  {
    id: 'big-sky',
    name: 'Big Sky Resort',
    region: 'montana',
    area: 'Gallatin Canyon',
    town: 'Big Sky',
    coords: [45.2778, -111.4103],
    size: 'major',
    tagline: 'Lone Peak, a tram to the top and 5,850 acres',
    summary:
      'One of the biggest ski areas in North America, built around the pyramid of Lone Peak and now including Moonlight Basin. Fast bubble chairs and a tram to 11,166 ft mean steep chutes up high and long cruisers below, with lots of room per skier. Best for strong skiers and families who want a full week, and it’s about an hour from Yellowstone’s west entrance.',
    url: 'https://www.bigskyresort.com/',
    snowReportUrl: 'https://www.bigskyresort.com/current-conditions',
    trailMapUrl: 'https://www.bigskyresort.com/trail-maps',
    webcamUrl: 'https://www.bigskyresort.com/current-conditions/webcams',
    passes: ['ikon', 'mountain-collective'],
    season: {
      opens: '2026-11-25',
      closes: '2027-04-25',
      note: 'Opening day Nov 25 is announced. Daily through Apr 11, then Fri–Sun bonus weekends Apr 16–18 and 23–25, conditions permitting.',
    },
    stats: {
      summitFt: 11166,
      baseFt: 6800,
      verticalFt: 4350,
      acres: 5850,
      trails: 320,
      lifts: 40,
      snowfallIn: 400,
      longestRunMi: 6,
      snowmakingPct: 10,
      terrain: { beginner: 21, intermediate: 29, advanced: 50 },
    },
    ticket: { from: 84, note: '2026-27 online low for early-season dates bought ahead; dynamic pricing runs about $270+ over the holidays. Tram and Kircliff included.' },
    activities: [
      'terrain-park', 'scenic-lift', 'snowshoeing', 'nordic', 'sleigh-rides', 'snowmobiling',
      'dog-sledding', 'ice-skating', 'spa', 'nightlife', 'kids',
    ],
    lodging: [
      {
        name: 'Summit Hotel',
        kind: 'slopeside',
        what: 'The resort’s top hotel in Mountain Village, recently renovated, with rooms, condos and penthouses a few steps from the lifts.',
        url: 'https://www.bigskyresort.com/lodging/hotels/summit-hotel',
        distance: 'Slopeside',
      },
      {
        name: 'Huntley Lodge',
        kind: 'slopeside',
        what: 'Big Sky’s original landmark hotel, with big family rooms, a pool and hot tubs, and the Huntley Dining Room downstairs.',
        url: 'https://www.bigskyresort.com/lodging/hotels/huntley-lodge',
        distance: 'Slopeside',
      },
      {
        name: 'Montage Big Sky',
        kind: 'ski-in/ski-out',
        what: 'Luxury resort in the Spanish Peaks with ski-in/ski-out access to the Big Sky terrain, a big spa and several restaurants.',
        url: 'https://www.montage.com/bigsky/',
        distance: 'Ski-in/ski-out',
      },
      {
        name: 'Lone Mountain Ranch',
        kind: 'cabin',
        what: 'Historic guest ranch of log cabins with its own nordic trails and the famous sleigh-ride dinner.',
        url: 'https://lonemountainranch.com/cabins/',
        distance: '10 min drive',
      },
      {
        name: 'The Wilson Hotel',
        kind: 'hotel',
        what: 'Modern hotel in Town Center with studios and suites, walkable to shops, the ice rink and the best of the town’s restaurants.',
        url: 'https://thewilsonhotel.com/',
        distance: '15 min drive',
      },
      {
        name: 'Rainbow Ranch Lodge',
        kind: 'inn',
        what: 'A 21-room riverside lodge on the Gallatin, quieter than the resort, with the Wild Caddis restaurant on site.',
        url: 'https://rainbowranchbigsky.com/',
        distance: '20 min drive',
      },
    ],
    thingsToDo: [
      { name: 'Lone Peak Tram and Kircliff', kind: 'scenic-lift', what: 'Ride the tram to 11,166 ft and step into Kircliff, a glass observatory with views into three states and two national parks. Included with lift tickets.', url: 'https://www.bigskyresort.com/kircliff', distance: 'On mountain' },
      { name: 'Montana Dinner Yurt', kind: 'eat', what: 'A snowcat ride up Lone Mountain to a lantern-lit yurt for a three-course dinner with live music. Bring your own drinks; kids sled while dinner cooks.', url: 'https://www.bigskyresort.com/winter-activities/culinary-experiences', distance: 'On mountain' },
      { name: 'Lone Mountain Ranch sleigh-ride dinner', kind: 'sleigh-rides', what: 'Horse-drawn sleigh to a lantern-lit cabin for a family-style prime rib dinner with cowboy music.', url: 'https://lonemountainranch.com/sleigh-ride-dinner/', distance: '10 min drive' },
      { name: 'Spirit of the North sled dogs', kind: 'dog-sledding', what: 'Drive your own husky team on trails in Moonlight Basin, with a snack stop along the way. All ages.', url: 'https://www.huskypower.com/', distance: '20 min drive' },
      { name: 'Yellowstone snowmobile tours (Two Top)', kind: 'snowmobiling', what: 'Guided day tours from West Yellowstone to Old Faithful or the Grand Canyon of the Yellowstone, past bison and elk.', url: 'https://www.yellowstonevacations.com/tour/two-top-snowmobile-tours/', distance: '1 hr drive' },
      { name: 'Canyon Adventures', kind: 'snowmobiling', what: 'Guided snowmobile rides in the Gallatin Canyon just south of the Big Sky turnoff.', url: 'https://www.canyonadventuresmt.com/', distance: '15 min drive' },
      { name: 'Lone Mountain Ranch nordic trails', kind: 'nordic', what: 'Groomed classic and skate trails through meadows and forest, with rentals and lessons.', url: 'https://lonemountainranch.com/nordic-ski-hub/', distance: '10 min drive' },
      { name: 'Marty Pavelich Ice Rink', kind: 'ice-skating', what: 'Outdoor community rink in Town Center with open skate sessions and Lone Mountain in the background. Rent skates in town.', url: 'https://www.bsco.org/park/marty-pavelich-ice-rink', distance: '15 min drive' },
    ],
    apres: [
      { name: 'Montana Jack', what: 'Lively tap house at the base in The Exchange, with 30 local beers on tap and burgers.', url: 'https://www.bigskyresort.com/dining/montana-jack' },
      { name: 'Iglu Big Sky', what: 'A snow-and-ice bar in the Bowl at the base of the tram, now reachable on foot from the Explorer Gondola.', url: 'https://www.bigskyresort.com/dining/iglu' },
      { name: 'Westward Social', what: 'Craft cocktails and shareable plates in Mountain Village, with views of Lone Peak.', url: 'https://www.bigskyresort.com/dining/westward-social' },
      { name: 'Lone Peak Brewery', what: 'Big Sky’s brewpub down in town, a locals’ spot for a pint and a burger.', url: 'https://www.lonepeakbrewery.com/' },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-11-25', when: 'Wed Nov 25, 9 am–4 pm', what: 'The 2026-27 season starts the day before Thanksgiving, with festivities in Mountain Village.', url: 'https://www.bigskyresort.com/events/winter-opening-day', confirmed: true },
      { name: 'Christmas celebrations', kind: 'christmas', date: '2026-12-21', end: '2026-12-25', when: 'Dec 21–25', what: 'A week of holiday events with Santa visits, fireworks and a Christmas feast. Details posted closer to the date.', url: 'https://www.bigskyresort.com/events/christmas', confirmed: true },
      { name: 'Christmas Eve torchlight parade and fireworks', kind: 'christmas', date: '2026-12-24', when: 'Dec 24, evening (annual)', what: 'Ski school instructors ski down with flares, then fireworks light up the mountain. Watch from the Mountain Village base.', url: 'https://www.bigskyresort.com/events/christmas', confirmed: false },
      { name: 'New Year’s Eve', kind: 'new-years', date: '2026-12-31', when: 'Dec 31', what: 'Daytime DJ at Everett’s 8800, music on the Mountain Village plaza, a 9 pm fireworks show and a party at Montana Jack (last year’s format).', url: 'https://www.bigskyresort.com/events/new-years-eve', confirmed: true },
      { name: 'Pond Skim', kind: 'pond-skim', date: '2027-04-10', when: 'Mid-April (annual)', what: 'Costumed skiers try to cross an icy pond in the Bowl, with a DJ set after. Ski-in only; a ticket or pass is required.', url: 'https://www.bigskyresort.com/events/spring-series/pond-skim', confirmed: false },
    ],
    getting: {
      airport: 'Bozeman Yellowstone International',
      code: 'BZN',
      driveMin: 60,
      from: [
        { city: 'Salt Lake City', hours: 6 },
        { city: 'Denver', hours: 10 },
      ],
    },
    google: { rating: 4.6, url: 'https://maps.google.com/?cid=9952576943490083444', asOf: ASOF },
    reviewThemes: {
      loved: [
        'Huge, varied terrain with short lift lines, even on busy days',
        'Lone Peak and the tram views from the summit',
        'Fast, modern heated lifts',
      ],
      watchFor: [
        'Tickets, food and lodging are expensive',
        'The tram and upper lifts close in high wind, and the tram line can be long',
      ],
    },
  },
];

export default resorts;
