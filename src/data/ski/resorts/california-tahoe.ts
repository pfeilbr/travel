import type { Resort } from '../types';

const ASOF = '2026-10-02';
const cid = (n: string) => `https://maps.google.com/?cid=${n}`;

const PAL = 'https://www.palisadestahoe.com';
const NS = 'https://www.northstarcalifornia.com';
const HV = 'https://www.skiheavenly.com';
const KW = 'https://www.kirkwood.com';
const SAT = 'https://sierraattahoe.com';
const SB = 'https://www.sugarbowl.com';
const HW = 'https://skihomewood.com';
const MR = 'https://skirose.com';
const DP = 'https://www.diamondpeak.com';
const BR = 'https://www.rideboreal.com';

// Shared lodging and things to do that serve more than one resort.
const hyattRegency = 'https://www.hyatt.com/hyatt-regency/en-US/tvllt-hyatt-regency-lake-tahoe-resort-spa-and-casino';
const hotelBecket = 'https://www.hotelbecket.com/';
const coachman = 'https://www.coachmantahoe.com/';
const zephyrCove = 'https://www.zephyrcove.com/specials-packages/winter-escape-rates-starting-at-105';
const basecampTahoeCity = 'https://www.basecamphotels.com/tahoe-city';
const granlibakken = 'https://www.granlibakken.com/';
const inclineLodge = 'https://theinclinelodge.com/';
const franciscan = 'https://www.franciscanlodge.com/';
const lochLeven = 'https://www.lochlevenlodge.com/';
const donnerLakeInn = 'https://www.donnerlakeinn.com/';
const donnerLakeVillage = 'https://www.donnerlakevillage.com/';
const crystalBay = 'https://www.crystalbaycasino.com/';
const adventureMountain = 'https://www.adventuremountaintahoe.com/';
const wildslide = 'https://wildslidetahoe.com/';
const borgesSleigh = 'https://www.sleighride.com/';
const royalGorge = `${SB}/royalgorge`;

const resorts: Resort[] = [
  {
    id: 'palisades-tahoe',
    name: 'Palisades Tahoe',
    region: 'california',
    area: 'North Lake Tahoe',
    town: 'Olympic Valley, CA',
    coords: [39.1906, -120.2484],
    size: 'major',
    tagline: 'Olympic steeps and two mountains linked by gondola',
    summary:
      'The 1960 Olympic venue, now two mountains, Palisades (Olympic Valley) and Alpine (Alpine Meadows), joined by a base-to-base gondola. KT-22 and Granite Chief pull in experts, while a walkable village with bars, tubing and an aerial tram to High Camp keeps everyone else busy. In good years it skis into late May.',
    url: `${PAL}/`,
    snowReportUrl: `${PAL}/mountain-information/mountain-report`,
    trailMapUrl: `${PAL}/mountain-information/trail-maps`,
    webcamUrl: `${PAL}/mountain-information/webcams`,
    passes: ['ikon'],
    season: {
      opens: '2026-11-25',
      closes: '2027-05-23',
      note: 'Opening day Nov 25 is on the resort calendar. Closing is the usual late-May target and depends on snow.',
    },
    stats: {
      summitFt: 9050, baseFt: 6200, verticalFt: 2850, acres: 6000, trails: 288, lifts: 39,
      snowfallIn: 400, longestRunMi: 3.2,
      terrain: { beginner: 25, intermediate: 43, advanced: 32 },
    },
    ticket: { from: 269, note: 'Online sample for Dec 21–22, 2025. Dynamic pricing; booking ahead for non-holiday dates saves up to 35%.' },
    activities: ['terrain-park', 'tubing', 'scenic-lift', 'snowshoeing', 'spa', 'nightlife', 'kids'],
    lodging: [
      { name: 'The Village at Palisades Tahoe', kind: 'base village', what: 'Condo-style rooms with kitchens and gas fireplaces, eight outdoor hot tubs and heated underground parking, steps from the lifts.', url: `${PAL}/plan-your-visit/lodging`, distance: 'Slopeside' },
      { name: 'Everline Resort & Spa', kind: 'hotel', what: 'Large resort at the mouth of Olympic Valley with a spa, pools and its own golf course.', url: 'https://www.everlineresort.com/', distance: 'In Olympic Valley' },
      { name: 'Basecamp Tahoe City', kind: 'hotel', what: 'Playful boutique hotel in Tahoe City, close to restaurants and the lake.', url: basecampTahoeCity, distance: '15 min drive' },
      { name: 'Granlibakken Tahoe', kind: 'lodge', what: 'Historic 74-acre resort with rooms, suites and townhomes, heated outdoor pools, a day spa and breakfast when you book direct.', url: granlibakken, distance: '20 min drive' },
      { name: 'Mother Nature’s Inn', kind: 'inn', what: 'Simple, pet-friendly inn in Tahoe City.', url: 'https://www.mothernaturesinn.com/', distance: '20 min drive' },
    ],
    thingsToDo: [
      { name: 'Sierra Sightseeing Pass', kind: 'scenic-lift', what: 'Non-skiers can ride the Aerial Tram, the Gold Coast Funitel and the Base-to-Base Gondola between Palisades and Alpine.', url: `${PAL}/events-and-activities/activity-finder/sierra-sightseeing-pass`, distance: 'On mountain' },
      { name: 'Olympic Museum at High Camp', kind: 'museum', what: '1960 Winter Games memorabilia and Team USA uniforms at the top of the tram.', url: `${PAL}/events-and-activities/activity-finder/olympic-museum`, distance: 'Top of the tram' },
      { name: 'Disco Tubing', kind: 'tubing', what: 'Evening tubing with lights, lasers and a DJ. Daytime tubing runs too.', url: `${PAL}/events-and-activities/activity-finder/disco-tubing`, distance: 'Olympic Valley base' },
      { name: 'Snowshoeing', kind: 'snowshoeing', what: 'Rentals and routes from the resort for a slower look at the valley.', url: `${PAL}/events-and-activities/activity-finder/snowshoeing`, distance: 'Olympic Valley' },
      { name: 'Everline Spa', kind: 'spa', what: 'Full-service spa at the Everline resort for a rest day.', url: 'https://www.everlineresort.com/spa', distance: '5 min drive' },
      { name: 'Granlibakken sled hill', kind: 'other', what: 'Sledding and a small ski hill in Tahoe City, since sledding isn’t allowed on the Palisades slopes.', url: granlibakken, distance: '20 min drive' },
    ],
    apres: [
      { name: 'KT Base Bar', what: 'Outdoor deck at the bottom of KT-22; free afternoon concerts during the holidays.', url: `${PAL}/events-and-activities/dining-and-apres/kt-base-bar` },
      { name: 'Tram Car Bar', what: 'Drinks inside a restored 1970s aerial tram cabin.', url: `${PAL}/events-and-activities/dining-and-apres/tram-car-bar` },
      { name: 'Le Chamois & Loft Bar', what: 'Long-running base-area spot for pizza, comfort food and cold beer.', url: `${PAL}/events-and-activities/dining-and-apres/le-chamois-loft-bar` },
      { name: 'The Chalet at Alpine', what: 'Bavarian-style beer garden on the mountain at Alpine.', url: `${PAL}/events-and-activities/dining-and-apres/chalet` },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-11-25', when: 'Nov 25', what: 'First chairs of the 2026–27 season, conditions permitting.', url: `${PAL}/events-and-activities/events-calendar/opening-day`, confirmed: true },
      { name: 'Tahoe Live', kind: 'music', date: '2026-12-11', end: '2026-12-13', when: 'Dec 11–13', what: 'Three-day electronic music festival in Olympic Valley.', url: `${PAL}/events-and-activities/events-calendar/tahoe-live`, confirmed: true },
      { name: 'Santa in the Village', kind: 'christmas', date: '2026-12-21', end: '2026-12-24', when: 'Dec 21–24', what: 'Story time, sing-alongs and photos with Santa at the Palisades and Alpine bases. Carolers usually sing in the Village too.', url: `${PAL}/events-and-activities/events-calendar/santa-schedule-1`, confirmed: true },
      { name: 'Christmas Eve Dinner', kind: 'christmas', date: '2026-12-24', when: 'Dec 24, evening', what: 'Holiday buffet with desserts and a champagne toast at the Olympic Village Event Center.', url: `${PAL}/events-and-activities/events-calendar/christmas-eve-dinner`, confirmed: true },
      { name: 'New Year’s Eve Family Celebration', kind: 'new-years', date: '2026-12-31', when: 'Dec 31 (annual)', what: 'Torchlight parade around 5 pm, fireworks over the KT Deck around 7 pm, disco tubing, live music and an East Coast balloon drop at 9 pm. Times are from 2025.', url: `${PAL}/events-and-activities/events-calendar/torchlight-parade`, confirmed: false },
      { name: 'Pain McShlonkey Classic', kind: 'festival', date: '2027-03-20', when: 'Mar 20', what: 'Costumed, comedic celebration of the late Shane McConkey.', url: `${PAL}/events-and-activities/events-calendar/pain-mcshlonkey-classic`, confirmed: true },
      { name: 'Cushing Crossing', kind: 'pond-skim', date: '2027-05-02', when: 'May 2', what: 'The 35th pond skim across Cushing Pond, with costumes, judges and an awards party.', url: `${PAL}/events-and-activities/events-calendar/cushing-crossing`, confirmed: true },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 60, from: [{ city: 'Sacramento', hours: 1.75 }, { city: 'San Francisco', hours: 3.5 }] },
    google: { rating: 4.6, url: cid('3512395326311175951'), asOf: ASOF },
    reviewThemes: {
      loved: ['Big, steep terrain that keeps experts happy for days', 'Two mountains on one ticket, now linked by gondola', 'A lively village with plenty of après'],
      watchFor: ['Highway 89 traffic and full parking lots on powder weekends', 'Lift lines and high walk-up prices at peak times'],
    },
  },
  {
    id: 'northstar',
    name: 'Northstar California',
    region: 'california',
    area: 'North Lake Tahoe',
    town: 'Truckee, CA',
    coords: [39.2647, -120.1332],
    size: 'major',
    tagline: 'Polished village, groomers and fireside s’mores',
    summary:
      'A Vail-run resort above Truckee built around a pedestrian village with an ice rink, free evening s’mores and plenty of places to eat. Mostly intermediate cruising with well-known grooming, plus gated tree terrain and a big park scene. Suits families and anyone who likes comfort with their skiing.',
    url: `${NS}/`,
    snowReportUrl: `${NS}/the-mountain/mountain-conditions/snow-and-weather-report.aspx`,
    trailMapUrl: `${NS}/the-mountain/about-the-mountain/trail-map.aspx`,
    webcamUrl: `${NS}/the-mountain/mountain-conditions/mountain-cams.aspx`,
    passes: ['epic'],
    season: {
      opens: '2026-11-20',
      closes: '2027-04-11',
      note: 'Opening day Nov 20 is announced. Closing is the usual mid-April pattern.',
    },
    stats: {
      summitFt: 8610, baseFt: 6330, verticalFt: 2280, acres: 3170, trails: 100, lifts: 20,
      snowfallIn: 350, longestRunMi: 3,
      terrain: { beginner: 13, intermediate: 60, advanced: 27 },
    },
    ticket: { from: 237, note: '2025-26 same-day weekday rate for mid-December; $289 on weekends. Epic Day Passes bought ahead cost less.' },
    activities: ['terrain-park', 'ice-skating', 'nordic', 'snowshoeing', 'spa', 'kids'],
    lodging: [
      { name: 'The Ritz-Carlton, Lake Tahoe', kind: 'ski-in/ski-out', what: 'Mid-mountain luxury hotel with a spa, linked to the Village by gondola.', url: 'https://www.ritzcarlton.com/en/hotels/rnorz-the-ritz-carlton-lake-tahoe/overview/', distance: 'Mid-mountain' },
      { name: 'Northstar Village lodging', kind: 'base village', what: 'Resort-booked condos around the skating rink, a short walk to the gondola.', url: `${NS}/plan-your-trip/stay/northstar-lodging.aspx`, distance: 'Slopeside' },
      { name: 'Franciscan Lakeside Lodge', kind: 'lodge', what: 'Lakeside rooms and cottages with kitchenettes in Tahoe Vista.', url: franciscan, distance: '20 min drive' },
      { name: 'Donner Lake Village', kind: 'condo', what: 'Hotel rooms and condos on the shore of Donner Lake, west of Truckee.', url: donnerLakeVillage, distance: '25 min drive' },
      { name: 'Donner Lake Inn', kind: 'b&b', what: 'Small B&B near Donner Lake with breakfast and a hot tub.', url: donnerLakeInn, distance: '25 min drive' },
    ],
    thingsToDo: [
      { name: 'Village ice rink', kind: 'ice-skating', what: 'Outdoor rink at the heart of the Village, with skate rentals and music.', url: `${NS}/explore-the-resort/activities-and-events/village-activities.aspx`, distance: 'In the Village' },
      { name: 'S’mores O’Clock', kind: 'eat', what: 'Free s’mores by the Village fire pits in the late afternoon.', url: `${NS}/explore-the-resort/activities-and-events/smores.aspx`, distance: 'In the Village' },
      { name: 'Tōst', kind: 'drink', what: 'Ski-up champagne stop with mountain views.', url: `${NS}/explore-the-resort/the-village/dining.aspx`, distance: 'On mountain' },
      { name: 'Northstar Cross Country & Snowshoe', kind: 'nordic', what: 'Groomed nordic trails and snowshoe routes on the resort.', url: `${NS}/explore-the-resort/activities-and-events/xc.aspx`, distance: 'On site' },
      { name: 'Tahoe Donner Cross Country', kind: 'nordic', what: 'One of the region’s bigger groomed nordic networks, in Truckee.', url: 'https://www.tahoedonner.com/cross-country/', distance: '20 min drive' },
      { name: 'Crystal Bay Casino', kind: 'nightlife', what: 'Casino and concert venue on the Nevada state line.', url: crystalBay, distance: '25 min drive' },
    ],
    apres: [
      { name: 'Rink Bar', what: 'Drinks right beside the skating rink.', url: `${NS}/explore-the-resort/the-village/dining.aspx` },
      { name: 'Wild Pine Kitchen & Bar', what: 'Modern mountain food and cocktails overlooking the rink.', url: `${NS}/explore-the-resort/the-village/dining.aspx` },
      { name: 'Tōst', what: 'Bubbly with a view before the last run down.', url: `${NS}/explore-the-resort/the-village/dining.aspx` },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-11-20', when: 'Nov 20', what: 'Start of the 2026–27 season, conditions permitting.', url: `${NS}/`, confirmed: true },
      { name: 'Winter Wonders', kind: 'christmas', date: '2026-12-18', end: '2027-01-03', when: 'Dec 18 (tree lighting) to Jan 3', what: 'Daily holiday program in the Village: skating, s’mores by the fire pits and live music.', url: `${NS}/explore-the-resort/activities-and-events/events-calendar.aspx`, confirmed: true },
      { name: 'New Year’s Eve in the Village', kind: 'new-years', date: '2026-12-31', when: 'Thu, Dec 31', what: 'Northstar’s yearly New Year’s Eve party in the Village, with a live band on the Village stage and fireworks.', url: `${NS}/explore-the-resort/activities-and-events/events-calendar.aspx`, confirmed: true },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 50, from: [{ city: 'Sacramento', hours: 1.75 }, { city: 'San Francisco', hours: 3.5 }] },
    google: { rating: 4.5, url: cid('17368340445863941698'), asOf: ASOF },
    reviewThemes: {
      loved: ['Excellent grooming and long, easy cruisers', 'A family-friendly village with the rink and free s’mores', 'Well-run lifts and lessons'],
      watchFor: ['Expensive tickets, food and parking', 'Busy weekends and holiday crowds'],
    },
  },
  {
    id: 'heavenly',
    name: 'Heavenly',
    region: 'california',
    area: 'South Lake Tahoe',
    town: 'South Lake Tahoe, CA',
    coords: [38.9287, -119.9051],
    size: 'major',
    tagline: 'Lake views from two states, casinos at the bottom',
    summary:
      'Tahoe’s biggest-vertical resort straddles the California–Nevada line, with the lake in view from much of the mountain. A gondola climbs straight out of Heavenly Village, and the Stateline casinos supply the nightlife. Good for groups who want big terrain by day and a lively town at night.',
    url: `${HV}/`,
    snowReportUrl: `${HV}/the-mountain/mountain-conditions/snow-and-weather-report.aspx`,
    trailMapUrl: `${HV}/the-mountain/about-the-mountain/trail-map.aspx`,
    webcamUrl: `${HV}/the-mountain/mountain-conditions/mountain-cams.aspx`,
    passes: ['epic'],
    season: {
      opens: '2026-11-20',
      closes: '2027-04-18',
      note: 'Opening day Nov 20 is announced. Usually closes mid-to-late April.',
    },
    stats: {
      summitFt: 10067, baseFt: 6657, verticalFt: 3410, acres: 4800, trails: 111, lifts: 28,
      snowfallIn: 251, longestRunMi: 5.5,
      terrain: { beginner: 15, intermediate: 53, advanced: 32 },
    },
    ticket: { from: 265, note: '2025-26 same-day window rate. Epic Day Passes bought ahead cost less.' },
    activities: ['terrain-park', 'scenic-lift', 'nightlife', 'snowmobiling', 'kids'],
    lodging: [
      { name: 'Heavenly Village lodging', kind: 'base village', what: 'Resort-booked condos and hotels around Heavenly Village, a short walk to the gondola.', url: `${HV}/plan-your-trip/stay/heavenly-lodging.aspx`, distance: 'Walk to the gondola' },
      { name: 'Hotel Becket', kind: 'hotel', what: 'Family-friendly boutique hotel near the Heavenly Gondola.', url: hotelBecket, distance: 'Walk to the gondola' },
      { name: 'The Coachman', kind: 'hotel', what: 'Small boutique hotel a few blocks from Heavenly Village.', url: coachman, distance: 'Walk to the Village' },
      { name: 'Harrah’s Lake Tahoe', kind: 'hotel', what: 'Big Stateline casino hotel with restaurants and shows.', url: 'https://www.caesars.com/harrahs-tahoe', distance: 'Walk to the gondola' },
      { name: 'Edgewood Tahoe', kind: 'hotel', what: 'Luxury lakefront lodge on a golf course at Stateline, with a spa.', url: 'https://edgewoodtahoe.com/', distance: '5 min drive' },
      { name: 'Zephyr Cove Resort', kind: 'cabin', what: 'Lakeside cabins on the Nevada shore, also home to snowmobile tours and lake cruises.', url: zephyrCove, distance: '15 min drive', priceFrom: 105, priceNote: 'Winter escape offer' },
    ],
    thingsToDo: [
      { name: 'Heavenly Scenic Gondola', kind: 'scenic-lift', what: 'Ride from Heavenly Village to an observation deck high over the lake.', url: `${HV}/explore-the-resort/activities/epic-discovery/scenic-gondola.aspx`, distance: 'Heavenly Village' },
      { name: 'Zephyr Cove snowmobiling', kind: 'snowmobiling', what: 'Guided snowmobile tours on trails above the lake.', url: 'https://www.zephyrcove.com/activities/winter/snowmobiling', distance: '15 min drive' },
      { name: 'M.S. Dixie II lake cruise', kind: 'other', what: 'Heated paddle-wheeler cruises on Lake Tahoe, running in winter too.', url: 'https://www.zephyrcove.com/cruise-experience', distance: '15 min drive' },
      { name: 'Adventure Mountain', kind: 'tubing', what: 'Tubing and snow play at 7,400 ft on Echo Summit.', url: adventureMountain, distance: '25 min drive' },
      { name: 'Himmel Haus', kind: 'eat', what: 'German beer hall with Bavarian food in South Lake Tahoe.', url: 'https://www.himmelhaustahoe.com/', distance: '5 min drive' },
      { name: 'Stateline casinos', kind: 'nightlife', what: 'Harrah’s and its neighbors keep bars, clubs and shows going late.', url: 'https://www.caesars.com/harrahs-tahoe', distance: 'Walk from the gondola' },
    ],
    apres: [
      { name: 'Tamarack Lodge', what: 'At the top of the gondola, with a deck looking over the lake.', url: `${HV}/explore-the-resort/about-the-resort/dining.aspx` },
      { name: 'Himmel Haus', what: 'Steins, pretzels and a crowd in ski boots.', url: 'https://www.himmelhaustahoe.com/' },
      { name: 'Stateline casino bars', what: 'Where the night carries on after dinner.', url: 'https://www.caesars.com/harrahs-tahoe' },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-11-20', when: 'Nov 20', what: 'Start of the 2026–27 season, conditions permitting.', url: `${HV}/`, confirmed: true },
      { name: 'Season Kick Off DJ Set', kind: 'music', date: '2026-12-19', when: 'Dec 19', what: 'An outdoor DJ set to kick off the holiday season.', url: `${HV}/explore-the-resort/experience-heavenly/events-calendar.aspx`, confirmed: true },
      { name: 'Air & Après', kind: 'festival', date: '2027-03-05', end: '2027-03-07', when: 'Mar 5–7', what: 'The fifth annual big air show weekend, with après parties.', url: `${HV}/explore-the-resort/experience-heavenly/events-calendar.aspx`, confirmed: true },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 75, from: [{ city: 'Sacramento', hours: 2 }, { city: 'San Francisco', hours: 3.75 }] },
    google: { rating: 4.4, url: cid('9365339745006710424'), asOf: ASOF },
    reviewThemes: {
      loved: ['Lake views that people call the best anywhere in skiing', 'Huge, varied terrain across two states', 'Restaurants and nightlife steps from the gondola'],
      watchFor: ['Long gondola lines on busy mornings', 'Wind holds on the upper lifts'],
    },
  },
  {
    id: 'kirkwood',
    name: 'Kirkwood',
    region: 'california',
    area: 'South Lake Tahoe',
    town: 'Kirkwood, CA',
    coords: [38.6848, -120.0652],
    size: 'major',
    tagline: 'Deep snow and steep lines off Carson Pass',
    summary:
      'Remote, high and snowy, Kirkwood sits at 7,800 ft in a bowl of cliffs and chutes south of the lake. Over half the terrain is advanced or expert, crowds are thin, and the small base village has condos, a few bars and a nordic center. Best for strong skiers who don’t need nightlife.',
    url: `${KW}/`,
    snowReportUrl: `${KW}/the-mountain/mountain-conditions/snow-and-weather-report.aspx`,
    trailMapUrl: `${KW}/the-mountain/about-the-mountain/trail-map.aspx`,
    webcamUrl: `${KW}/the-mountain/mountain-conditions/mountain-cams.aspx`,
    passes: ['epic'],
    season: {
      opens: '2026-12-04',
      closes: '2027-04-11',
      note: 'Opening day Dec 4 is announced. Usually closes mid-April.',
    },
    stats: {
      summitFt: 9800, baseFt: 7800, verticalFt: 2000, acres: 2300, trails: 86, lifts: 15,
      snowfallIn: 354, longestRunMi: 2.5,
      terrain: { beginner: 12, intermediate: 30, advanced: 58 },
    },
    ticket: { from: 163, note: '2025-26 rate for Dec 23. Dynamic pricing; Epic Day Passes bought ahead cost less.' },
    activities: ['terrain-park', 'nordic', 'snowshoeing', 'kids'],
    lodging: [
      { name: 'Kirkwood village lodging', kind: 'base village', what: 'Condos and lodges in the small base village, booked through the resort.', url: `${KW}/plan-your-trip/stay/kirkwood-lodging.aspx`, distance: 'Slopeside' },
      { name: 'Caples Lake Resort', kind: 'cabin', what: 'Cabins and lodge rooms on Caples Lake with a restaurant and lounge. Opens for winter on Dec 17.', url: 'https://www.capleslakeresort.com/', distance: '5 min drive' },
      { name: 'Hotel Becket', kind: 'hotel', what: 'Family-friendly boutique hotel in South Lake Tahoe, if you want town life.', url: hotelBecket, distance: '50 min drive' },
    ],
    thingsToDo: [
      { name: 'Kirkwood Cross Country & Snowshoe', kind: 'nordic', what: 'Groomed nordic trails and snowshoe routes in the meadows below the resort.', url: `${KW}/explore-the-resort/activities-and-events/cross-country.aspx`, distance: 'On site' },
      { name: 'Caples Lake Resort', kind: 'eat', what: 'Lakeside restaurant and lounge. Check winter days and hours.', url: 'https://www.capleslakeresort.com/', distance: '5 min drive' },
      { name: 'Adventure Mountain', kind: 'tubing', what: 'Tubing and snow play at 7,400 ft on Echo Summit.', url: adventureMountain, distance: '40 min drive' },
      { name: 'Grover Hot Springs State Park', kind: 'hot-springs', what: 'Mineral pool fed by hot springs near Markleeville. Check pool days before you go.', url: 'https://www.parks.ca.gov/?page_id=508', distance: '50 min drive' },
    ],
    apres: [
      { name: 'The Cornice', what: 'Pizza and a weekday happy hour, 3–6 pm.', url: `${KW}/explore-the-resort/during-your-stay/dining.aspx` },
      { name: 'K-Bar', what: 'The village bar, with drinks and mountain views.', url: `${KW}/explore-the-resort/during-your-stay/dining.aspx` },
      { name: 'The Wall Bar & Grill', what: 'American bistro with local wine, spirits and beer.', url: `${KW}/explore-the-resort/during-your-stay/dining.aspx` },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-12-04', when: 'Dec 4', what: 'Start of the 2026–27 season, conditions permitting.', url: `${KW}/explore-the-resort/activities-and-events/events.aspx`, confirmed: true },
      { name: 'Solstice Cinema', kind: 'other', date: '2026-12-20', when: 'Dec 20', what: 'A community night of ski movies.', url: `${KW}/explore-the-resort/activities-and-events/events.aspx`, confirmed: true },
      { name: 'NYE Fireworks and Torchlight Parade', kind: 'new-years', date: '2026-12-31', when: 'Dec 31', what: 'Fireworks, bonfires and Kirkwood’s torchlight parade.', url: `${KW}/explore-the-resort/activities-and-events/events.aspx`, confirmed: true },
      { name: 'IFSA Junior 2*', kind: 'race', date: '2027-01-23', end: '2027-01-24', when: 'Jan 23–24', what: 'Junior freeride competition on Kirkwood’s steep terrain.', url: `${KW}/explore-the-resort/activities-and-events/events.aspx`, confirmed: true },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 110, from: [{ city: 'Sacramento', hours: 2 }, { city: 'San Francisco', hours: 3.5 }] },
    google: { rating: 4.6, url: cid('10042446398587528607'), asOf: ASOF },
    reviewThemes: {
      loved: ['Deep, reliable snow and serious expert terrain', 'Short lines compared with the North Shore resorts', 'A quiet, old-school mountain feel'],
      watchFor: ['Highway 88 can close or need chains in storms', 'Few services and dining options once you’re there'],
    },
  },
  {
    id: 'sierra-at-tahoe',
    name: 'Sierra-at-Tahoe',
    region: 'california',
    area: 'South Lake Tahoe',
    town: 'Twin Bridges, CA',
    coords: [38.8002, -120.0804],
    size: 'mid',
    tagline: 'Friendly tree skiing, back after the Caldor fire',
    summary:
      'The closest Tahoe resort to Sacramento and the Bay Area, off Highway 50, celebrating its 80th winter. The 2021 Caldor fire burned across the mountain; it reopened, added West Bowl trails and finished replanting more than 60,000 trees in 2026. Relaxed, good value and family-friendly, and now on the Ikon Pass.',
    url: `${SAT}/`,
    snowReportUrl: `${SAT}/weather-snow-report/`,
    trailMapUrl: `${SAT}/trail-map/`,
    webcamUrl: `${SAT}/live-cams/`,
    passes: ['ikon'],
    season: {
      opens: '2026-11-27',
      closes: '2027-04-11',
      note: 'Opens on natural snow, usually late November to mid-December (Dec 27 in 2025). Typically closes mid-April. Weekend and holiday parking needs a reservation this season.',
    },
    stats: {
      summitFt: 8852, baseFt: 6640, verticalFt: 2212, acres: 2000, trails: 50, lifts: 14,
      snowfallIn: 480, longestRunMi: 2.5,
      terrain: { beginner: 25, intermediate: 50, advanced: 25 },
    },
    ticket: { from: 167, note: '2026-27 non-peak day rate; $191 on peak days. 3-packs from $97 a day.' },
    activities: ['terrain-park', 'tubing', 'kids'],
    lodging: [
      { name: 'Hotel Becket', kind: 'hotel', what: 'Family-friendly boutique hotel near the Heavenly Gondola in South Lake Tahoe.', url: hotelBecket, distance: '30 min drive' },
      { name: 'The Coachman', kind: 'hotel', what: 'Small boutique hotel near Heavenly Village.', url: coachman, distance: '30 min drive' },
      { name: 'The Landing Tahoe', kind: 'hotel', what: 'Lakefront luxury resort and spa in South Lake Tahoe.', url: 'https://www.thelandingtahoe.com/', distance: '30 min drive' },
      { name: 'Zephyr Cove Resort', kind: 'cabin', what: 'Lakeside cabins on the Nevada shore.', url: zephyrCove, distance: '40 min drive', priceFrom: 105, priceNote: 'Winter escape offer' },
    ],
    thingsToDo: [
      { name: 'Blizzard Mountain', kind: 'tubing', what: 'Tubing lift and snow play area at the base; tubing $65, snow play $45.', url: `${SAT}/tubing-hill/`, distance: 'At the base' },
      { name: '360 Smokehouse BBQ', kind: 'eat', what: 'Barbecue off the Grandview Express with lake views.', url: `${SAT}/dining/dining-360-smokehouse-bbq/`, distance: 'On mountain' },
      { name: 'Adventure Mountain', kind: 'tubing', what: 'Tubing and snow play at 7,400 ft on Echo Summit.', url: adventureMountain, distance: '10 min drive' },
      { name: 'Heavenly Scenic Gondola', kind: 'scenic-lift', what: 'Gondola ride from Heavenly Village to an observation deck over the lake.', url: `${HV}/explore-the-resort/activities/epic-discovery/scenic-gondola.aspx`, distance: '30 min drive' },
      { name: 'Zephyr Cove snowmobiling', kind: 'snowmobiling', what: 'Guided snowmobile tours above the lake.', url: 'https://www.zephyrcove.com/activities/winter/snowmobiling', distance: '40 min drive' },
    ],
    apres: [
      { name: 'The Pub', what: 'Main Lodge pub with microbrews, a daily happy hour and live music.', url: `${SAT}/dining/dining-the-sierra-pub/` },
      { name: 'Corkscrew Bar', what: 'Cocktails, with outdoor service on The Plaza on sunny days.', url: `${SAT}/dining/dining-corkscrew-bar/` },
      { name: 'Grand Brew', what: 'Coffee in the morning, beer and cocktails after the lifts close.', url: `${SAT}/dining/grand-brew/` },
    ],
    events: [
      { name: '80th anniversary celebration', kind: 'festival', date: '2026-12-21', when: 'Around Dec 21', what: 'Celebration around the resort’s original 1946 opening date, plus a historic photo gallery in Aspen Cafe all season.', url: `${SAT}/whats-new-2026-80th-anniversary/`, confirmed: false },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 95, from: [{ city: 'Sacramento', hours: 1.75 }, { city: 'San Francisco', hours: 3.25 }] },
    google: { rating: 4.6, url: cid('7554002521883104240'), asOf: ASOF },
    reviewThemes: {
      loved: ['Friendly staff and a laid-back, local feel', 'Good value compared with the big-name resorts', 'Fun tree skiing and terrain parks'],
      watchFor: ['Highway 50 traffic on weekends', 'Burned areas still look sparse in places'],
    },
  },
  {
    id: 'sugar-bowl',
    name: 'Sugar Bowl',
    region: 'california',
    area: 'Donner Summit',
    town: 'Norden, CA',
    coords: [39.3052, -120.333],
    size: 'mid',
    tagline: 'Big snow and a car-free village on Donner Summit',
    summary:
      'Founded in 1939 and still independent, Sugar Bowl sits on Donner Summit and catches Pacific storms first, averaging about 500 inches. Four peaks, real steeps and a slopeside village you reach only by gondola, with a new Village Gondola this season. Royal Gorge’s groomed cross-country trails are part of the resort.',
    url: `${SB}/`,
    snowReportUrl: `${SB}/conditions`,
    trailMapUrl: `${SB}/trailmaps`,
    webcamUrl: `${SB}/webcams`,
    passes: ['mountain-collective'],
    season: {
      opens: '2026-11-27',
      closes: '2027-04-18',
      note: 'Targets Nov 27, conditions permitting. Usually closes mid-to-late April.',
    },
    stats: {
      summitFt: 8383, baseFt: 6883, verticalFt: 1500, acres: 1650, trails: 105, lifts: 12,
      snowfallIn: 500, longestRunMi: 3,
      terrain: { beginner: 14, intermediate: 42, advanced: 44 },
    },
    ticket: { from: 89, note: 'Online Mon–Thu non-holiday price, bought by Nov 26. Window rates run $189–249.' },
    activities: ['terrain-park', 'tubing', 'nordic', 'snowshoeing', 'spa', 'kids'],
    lodging: [
      { name: 'The Village Lodge at Sugar Bowl', kind: 'ski-in/ski-out', what: 'Historic 27-room lodge in a car-free village you reach by gondola. Walt Disney was a regular.', url: `${SB}/hotel`, distance: 'Slopeside', priceFrom: 239, priceNote: 'Smallest rooms; most rooms $269–449' },
      { name: 'Sugar Bowl vacation rentals', kind: 'condo', what: 'Homes and condos in and around the Village, booked through the resort.', url: `${SB}/propertyrentals`, distance: 'Slopeside' },
      { name: 'Loch Leven Lodge', kind: 'lodge', what: 'Small lakeside lodge on Donner Lake.', url: lochLeven, distance: '15 min drive' },
      { name: 'Donner Lake Inn', kind: 'b&b', what: 'Small B&B near Donner Lake with breakfast and a hot tub.', url: donnerLakeInn, distance: '15 min drive' },
    ],
    thingsToDo: [
      { name: 'Royal Gorge Cross Country', kind: 'nordic', what: 'More than 100 km of groomed skate and classic trails, plus snowshoe routes.', url: royalGorge, distance: '5 min drive' },
      { name: 'Sugar Rush Tubing', kind: 'tubing', what: 'Ten tubing lanes with a covered carpet, plus a snow play area for small kids.', url: `${SB}/tubing`, distance: 'On site' },
      { name: 'Sporthaus yoga and massage', kind: 'spa', what: 'Yoga classes and massage open to all guests in the Village.', url: `${SB}/sporthaus`, distance: 'In the Village' },
      { name: 'Yarrow', kind: 'eat', what: 'Seasonal California cooking in the Village Lodge. Check it has reopened after the lodge renovation.', url: `${SB}/yarrow`, distance: 'In the Village' },
      { name: 'Backcountry gates', kind: 'other', what: 'Gated access to Sierra backcountry for skiers with the gear and training.', url: `${SB}/backcountry`, distance: 'On mountain' },
    ],
    apres: [
      { name: 'Judah Bar', what: 'Sun-deck bar outside the Main Lodge.', url: `${SB}/judah-bar` },
      { name: 'Palisades Smoke Kitchen + Bar', what: 'Barbecue downstairs and a bar upstairs at the Mid Mountain Lodge.', url: `${SB}/smoke-kitchen` },
      { name: 'The Belt Room', what: 'Historic Village Lodge bar, reopening after the lodge renovation.', url: `${SB}/beltroom` },
    ],
    events: [
      { name: 'Tube-or-Treat', kind: 'other', date: '2026-10-31', end: '2026-11-01', when: 'Oct 31–Nov 1', what: 'Halloween tubing on machine-made snow with a DJ, trick-or-treating and a costume contest.', url: `${SB}/tubing`, confirmed: true },
      { name: 'Opening Day', kind: 'opening', date: '2026-11-27', when: 'Nov 27', what: 'Targeted start of the season, conditions permitting.', url: `${SB}/events`, confirmed: true },
      { name: 'Pond Skim', kind: 'pond-skim', date: '2027-04-25', when: 'Late April (annual)', what: 'Costumed skim across a pond in the Village, then music on the Village deck.', url: `${SB}/events`, confirmed: false },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 50, from: [{ city: 'Sacramento', hours: 1.5 }, { city: 'San Francisco', hours: 3 }] },
    google: { rating: 4.6, url: cid('15196496299948665621'), asOf: ASOF },
    reviewThemes: {
      loved: ['Lots of snow and steep, interesting terrain', 'The quickest big mountain from the Bay Area on I-80', 'Independent, old-school charm and shorter lines'],
      watchFor: ['I-80 closures and chain controls in storms', 'Wind can shut the upper lifts'],
    },
  },
  {
    id: 'homewood',
    name: 'Homewood Mountain Resort',
    region: 'california',
    area: 'North Lake Tahoe',
    town: 'Homewood, CA',
    coords: [39.0856, -120.1605],
    size: 'mid',
    tagline: 'Lake views on every run and rare Tahoe cat skiing',
    summary:
      'A quiet West Shore hill that drops almost to the water, with lake views from all 66 runs. A new eight-seat gondola from the lakefront base is due for winter 2026–27, and guided snowcat days run on Ellis Peak. Lower elevation means thin snow in dry years, but crowds are rare.',
    url: `${HW}/`,
    snowReportUrl: `${HW}/snowreport/`,
    trailMapUrl: `${HW}/trailmap/`,
    webcamUrl: `${HW}/webcams/`,
    passes: [],
    season: {
      opens: '2026-12-26',
      closes: '2027-04-04',
      note: 'Plans to open in December with the new gondola; OnTheSnow lists Dec 26. Usually closes early April (it closed Mar 17 in 2026 after a thin winter).',
    },
    stats: {
      summitFt: 7880, baseFt: 6230, verticalFt: 1650, acres: 1260, trails: 66, lifts: 7,
      snowfallIn: 450, longestRunMi: 2,
      terrain: { beginner: 15, intermediate: 40, advanced: 45 },
    },
    activities: ['cat-skiing', 'terrain-park', 'kids'],
    lodging: [
      { name: 'West Shore Café & Inn', kind: 'inn', what: 'Boutique inn and lakeside restaurant across the road from the base.', url: 'https://www.westshorecafe.com/', distance: 'Across the road' },
      { name: 'Tahoma Meadows B&B Cottages', kind: 'cabin', what: 'Cottages in the pines at Tahoma, just south of Homewood.', url: 'https://www.tahomameadows.com/', distance: '5 min drive' },
      { name: 'Basecamp Tahoe City', kind: 'hotel', what: 'Playful boutique hotel in Tahoe City.', url: basecampTahoeCity, distance: '15 min drive' },
      { name: 'Granlibakken Tahoe', kind: 'lodge', what: 'Historic resort with rooms and townhomes, pools, a spa and breakfast when you book direct.', url: granlibakken, distance: '15 min drive' },
    ],
    thingsToDo: [
      { name: 'Homewood Snowcat Adventures', kind: 'cat-skiing', what: 'Private full-day guided cat skiing on Ellis Peak for up to eight people, about $4,500 a group.', url: `${HW}/snowcatadventures/`, distance: 'On site' },
      { name: 'Sugar Pine Point State Park', kind: 'nordic', what: 'Cross-country trails on the 1960 Olympic nordic course.', url: 'https://www.parks.ca.gov/?page_id=510', distance: '10 min drive' },
      { name: 'West Shore Café', kind: 'eat', what: 'Lakeside dining across the road from the lifts.', url: 'https://www.westshorecafe.com/', distance: 'Across the road' },
      { name: 'Granlibakken sled hill', kind: 'other', what: 'Sledding and a small ski hill in Tahoe City.', url: granlibakken, distance: '15 min drive' },
    ],
    apres: [
      { name: '89 Bar & Grill', what: 'Smash burgers at the base and après until last call.', url: `${HW}/dining/` },
      { name: 'Big Blue View Bar', what: 'Mid-mountain bar with a huge lake view and DJs on Saturdays.', url: `${HW}/dining/` },
      { name: 'West Shore Café', what: 'Lakeside bar and restaurant across the road.', url: 'https://www.westshorecafe.com/' },
    ],
    events: [
      { name: 'Opening day and new gondola', kind: 'opening', date: '2026-12-26', when: 'December (target)', what: 'The season opens with the new lakefront gondola to a future mid-mountain lodge site.', url: `${HW}/gondola/`, confirmed: false },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 75, from: [{ city: 'Sacramento', hours: 2 }, { city: 'San Francisco', hours: 3.75 }] },
    google: { rating: 4.4, url: cid('8336378872505370253'), asOf: ASOF },
    reviewThemes: {
      loved: ['Lake views from nearly every run', 'No crowds and a relaxed, friendly vibe', 'Good tree skiing after storms'],
      watchFor: ['Low elevation means thin or patchy snow some years', 'Limited services and older facilities'],
    },
  },
  {
    id: 'mt-rose',
    name: 'Mt. Rose Ski Tahoe',
    region: 'california',
    area: 'North Lake Tahoe',
    town: 'Reno, NV',
    coords: [39.3151, -119.8824],
    size: 'mid',
    tagline: 'Tahoe’s highest base, 25 minutes from Reno',
    summary:
      'Mt. Rose sits at the top of the Mt. Rose Highway between Reno and Incline Village, with an 8,260 ft base that holds snow when lower resorts struggle. The Chutes give it serious expert terrain, and a new tubing park, Wildslide, opens next door. Easy to pair with a Reno hotel stay.',
    url: `${MR}/`,
    snowReportUrl: `${MR}/snow-report/`,
    trailMapUrl: `${MR}/trail-maps/`,
    webcamUrl: `${MR}/the-mountain-web-cams/`,
    passes: [],
    season: {
      opens: '2026-11-20',
      closes: '2027-04-18',
      note: 'Targets Nov 20. Usually one of the last Tahoe resorts to close, mid-April or later.',
    },
    stats: {
      summitFt: 9700, baseFt: 7900, verticalFt: 1800, acres: 1200, trails: 70, lifts: 7,
      snowfallIn: 350, longestRunMi: 2.5,
      terrain: { beginner: 20, intermediate: 30, advanced: 50 },
    },
    ticket: { from: 119, note: '2025-26 online low; same-day window was $189 in 2024-25. Buy online by midnight the day before.' },
    activities: ['terrain-park', 'tubing', 'kids'],
    lodging: [
      { name: 'The Incline Lodge', kind: 'hotel', what: 'Boutique hotel in Incline Village.', url: inclineLodge, distance: '15 min drive' },
      { name: 'Hyatt Regency Lake Tahoe', kind: 'hotel', what: 'Lakefront resort with a spa and casino in Incline Village.', url: hyattRegency, distance: '20 min drive' },
      { name: 'Peppermill Reno', kind: 'hotel', what: 'Big Reno casino resort with a spa; a Mt. Rose lodging partner.', url: 'https://www.peppermillreno.com/', distance: '30 min drive' },
      { name: 'Atlantis Casino Resort Spa', kind: 'hotel', what: 'South Reno casino hotel, close to the Mt. Rose Highway.', url: 'https://atlantiscasino.com/', distance: '30 min drive' },
      { name: 'J Resort Reno', kind: 'hotel', what: 'Newer downtown Reno casino hotel.', url: 'https://www.jresortreno.com/', distance: '35 min drive' },
    ],
    thingsToDo: [
      { name: 'Wildslide', kind: 'tubing', what: 'New tubing park from the Mt. Rose team with up to 20 lanes; opens Thanksgiving 2026.', url: wildslide, distance: 'Next door' },
      { name: 'Borges Sleigh Rides', kind: 'sleigh-rides', what: 'Horse-drawn sleigh rides at Sand Harbor State Park on the lake.', url: borgesSleigh, distance: '25 min drive' },
      { name: 'Crystal Bay Casino', kind: 'nightlife', what: 'Casino and concert venue on the Nevada state line.', url: crystalBay, distance: '25 min drive' },
      { name: 'National Automobile Museum', kind: 'museum', what: 'Large classic-car collection in downtown Reno.', url: 'https://www.automuseum.org/', distance: '35 min drive' },
    ],
    apres: [
      { name: 'Timbers Bar', what: 'Main Lodge après bar with craft beer and live music most weekends.', url: `${MR}/dining/` },
      { name: 'Hela’s Cantina', what: 'Upstairs tacos, nachos and margaritas.', url: `${MR}/dining/` },
      { name: 'Crystal Bay Casino', what: 'Bands and late nights at the state line on the way down to the lake.', url: crystalBay },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-11-20', when: 'Nov 20', what: 'Targeted start of the season, conditions permitting.', url: `${MR}/`, confirmed: true },
      { name: 'Santa Ski', kind: 'christmas', date: '2026-12-12', when: 'Dec 12, 10:30 am–2 pm', what: 'Ski in a full Santa suit or holiday outfit for a discounted lift ticket. A hat alone doesn’t count.', url: `${MR}/rose-events/santa-ski-2026-2/`, confirmed: true },
      { name: 'New Year’s Eve at Mt. Rose', kind: 'new-years', date: '2026-12-31', when: 'Dec 31 (annual)', what: 'Snowcat parade, a ski team torchlight parade and fireworks at the Main Lodge, starting late afternoon. Arrive early; parking fills.', url: `${MR}/calendar-events/`, confirmed: false },
      { name: 'Tahoe Freeride', kind: 'race', date: '2027-03-06', end: '2027-03-07', when: 'Mar 6–7', what: 'Freeride competition in Mt. Rose’s expert terrain.', url: `${MR}/rose-events/tahoe-freeride/`, confirmed: true },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 35, from: [{ city: 'Reno', hours: 0.5 }, { city: 'Sacramento', hours: 2.25 }, { city: 'San Francisco', hours: 4 }] },
    google: { rating: 4.6, url: cid('2023929387310150557'), asOf: ASOF },
    reviewThemes: {
      loved: ['The fastest ski day from Reno', 'High base keeps snow quality good', 'The Chutes for experts, at fair prices'],
      watchFor: ['Wind holds and whiteouts on stormy days', 'Parking fills on weekends and the highway can be slick'],
    },
  },
  {
    id: 'diamond-peak',
    name: 'Diamond Peak',
    region: 'california',
    area: 'North Lake Tahoe',
    town: 'Incline Village, NV',
    coords: [39.2537, -119.9238],
    size: 'local',
    tagline: 'Small, sunny and right above Lake Tahoe',
    summary:
      'Owned by the Incline Village community, Diamond Peak is a compact, friendly hill whose Crystal Ridge has some of the best lake views in Tahoe. It suits families and intermediates, prices stay reasonable, and community events like Ullr Fest and the Dummy Downhill fill the calendar.',
    url: `${DP}/`,
    snowReportUrl: `${DP}/the-mountain/mountain-report/`,
    trailMapUrl: `${DP}/the-mountain/trail-map/`,
    webcamUrl: `${DP}/the-mountain/web-cams/`,
    passes: [],
    season: {
      opens: '2026-12-03',
      closes: '2027-04-04',
      note: 'Opening day announced (Thu Dec 3, conditions permitting). Closing isn’t set; usually late March to mid-April.',
    },
    stats: {
      summitFt: 8540, baseFt: 6700, verticalFt: 1840, acres: 655, trails: 40, lifts: 7,
      snowfallIn: 325, longestRunMi: 2.1, snowmakingPct: 75,
      terrain: { beginner: 18, intermediate: 46, advanced: 36 },
    },
    ticket: { from: 137, note: '2025-26 online value-day rate; $169 weekends, $179 peak, $10 more at the window.' },
    activities: ['terrain-park', 'kids'],
    lodging: [
      { name: 'The Incline Lodge', kind: 'hotel', what: 'Boutique hotel about a mile from the slopes.', url: inclineLodge, distance: '5 min drive' },
      { name: 'Hyatt Regency Lake Tahoe', kind: 'hotel', what: 'Lakefront resort with a free ski shuttle, a rental shop and Diamond Peak tickets in the lobby.', url: hyattRegency, distance: '5 min drive' },
      { name: 'Club Tahoe', kind: 'condo', what: 'Timeshare townhomes in Incline with a heated pool and a game-room clubhouse.', url: 'https://www.clubtahoe.com/', distance: '5 min drive' },
      { name: 'Franciscan Lakeside Lodge', kind: 'lodge', what: 'Lakeside rooms and cottages with kitchenettes in Tahoe Vista.', url: franciscan, distance: '15 min drive' },
    ],
    thingsToDo: [
      { name: 'Last Tracks', kind: 'drink', what: 'Wine or beer tasting on the Snowflake Lodge deck, then the day’s last run. Most Wednesdays from February.', url: `${DP}/tickets-passes-rentals/special-offers/last-tracks/`, distance: 'Mid-mountain' },
      { name: 'Borges Sleigh Rides', kind: 'sleigh-rides', what: 'Horse-drawn sleigh rides at Sand Harbor State Park.', url: borgesSleigh, distance: '10 min drive' },
      { name: 'Crystal Bay Casino', kind: 'nightlife', what: 'Casino and concert venue on the state line.', url: crystalBay, distance: '10 min drive' },
      { name: 'Wildslide at Mt. Rose', kind: 'tubing', what: 'New tubing park with up to 20 lanes.', url: wildslide, distance: '20 min drive' },
    ],
    apres: [
      { name: 'Loft Bar', what: 'Base Lodge bar with beer, wine, cocktails and afternoon snacks.', url: `${DP}/visit/dining/` },
      { name: 'Snowflake Lodge deck', what: 'Mid-mountain deck with a big lake view; home of Last Tracks.', url: `${DP}/visit/dining/` },
      { name: 'Crystal Bay Casino', what: 'Live music 10 minutes away.', url: crystalBay },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-12-03', when: 'Thu Dec 3 (conditions permitting)', what: 'Planned start of the 2026-27 season.', url: `${DP}/news/whats-new-at-diamond-peak-ski-resort-for-the-2026-27-ski-season/`, confirmed: true },
      { name: 'Santa and Penguin Pete', kind: 'christmas', date: '2026-12-24', end: '2026-12-25', when: 'Dec 24–25, 10 am–noon', what: 'Santa and the resort mascot hand out treats on the slopes and in the base area.', url: `${DP}/event/santa-penguin-pete-visit-diamond-peak/`, confirmed: true },
      { name: 'Ullr Fest', kind: 'festival', date: '2027-01-29', when: 'Jan 29, 4–8 pm', what: 'Community party with a torchlight parade, bonfire, music and raffles for the ski team. Free entry.', url: `${DP}/event/ullr-fest/`, confirmed: true },
      { name: 'Luggi Foeger Uphill/Downhill Festival', kind: 'race', date: '2027-03-20', when: 'Mar 20', what: 'Ski mountaineering race and festival, up and down under your own power.', url: `${DP}/event/luggi-foeger-uphill-downhill-festival/`, confirmed: true },
      { name: 'Dummy Downhill', kind: 'festival', date: '2027-03-27', when: 'Mar 27, 10 am–2 pm', what: 'The 25th year of homemade dummies launched off a big jump.', url: `${DP}/event/dummy-downhill/`, confirmed: true },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 45, from: [{ city: 'Reno', hours: 0.75 }, { city: 'Sacramento', hours: 2.25 }, { city: 'San Francisco', hours: 4 }] },
    google: { rating: 4.6, url: cid('8390416013163737751'), asOf: ASOF },
    reviewThemes: {
      loved: ['Stunning lake views from the top', 'Friendly, uncrowded and good for families', 'Fair prices for Tahoe'],
      watchFor: ['Small, with limited expert terrain', 'Relies on snowmaking in lean years'],
    },
  },
  {
    id: 'boreal',
    name: 'Boreal Mountain',
    region: 'california',
    area: 'Donner Summit',
    town: 'Soda Springs, CA',
    coords: [39.336, -120.3505],
    size: 'local',
    tagline: 'Parks, night laps and Tahoe’s easiest drive',
    summary:
      'Right off I-80 at Donner Summit, Boreal is a small hill built around terrain parks and the Woodward Tahoe action-sports center, whose indoor Bunker has a skatepark and trampolines. Night skiing runs seven days a week, so it suits after-work laps, park riders and kids learning.',
    url: `${BR}/`,
    snowReportUrl: `${BR}/explore/status-conditions/`,
    trailMapUrl: `${BR}/explore/facilities/trail-maps/`,
    webcamUrl: `${BR}/explore/webcams/boreal-mountain-cam/`,
    passes: [],
    season: {
      opens: '2026-11-27',
      closes: '2027-04-11',
      note: 'Targets Nov 27 and is usually one of the first to open. Typically closes mid-April.',
    },
    stats: {
      summitFt: 7700, baseFt: 7200, verticalFt: 500, acres: 380, trails: 41, lifts: 7,
      snowfallIn: 400, longestRunMi: 1,
      terrain: { beginner: 30, intermediate: 55, advanced: 15 },
    },
    ticket: { from: 144, note: '2025-26 Go-Time ticket sample for Dec 22; dynamic pricing. A Night Pass covers 3–8 pm.' },
    activities: ['night-skiing', 'terrain-park', 'tubing', 'kids'],
    lodging: [
      { name: 'The Village Lodge at Sugar Bowl', kind: 'lodge', what: 'Historic gondola-access lodge one exit away.', url: `${SB}/hotel`, distance: '5 min drive', priceFrom: 239, priceNote: 'Smallest rooms' },
      { name: 'Loch Leven Lodge', kind: 'lodge', what: 'Small lakeside lodge on Donner Lake.', url: lochLeven, distance: '10 min drive' },
      { name: 'Donner Lake Inn', kind: 'b&b', what: 'Small B&B with breakfast and a hot tub.', url: donnerLakeInn, distance: '10 min drive' },
      { name: 'Donner Lake Village', kind: 'condo', what: 'Hotel rooms and condos on the shore of Donner Lake.', url: donnerLakeVillage, distance: '10 min drive' },
    ],
    thingsToDo: [
      { name: 'Woodward Tahoe Bunker', kind: 'other', what: 'Indoor skatepark, trampolines and foam pits for action-sports sessions.', url: `${BR}/explore/who-we-are/what-to-expect-ww/bunker/`, distance: 'At the base' },
      { name: 'Tahoe Tubing', kind: 'tubing', what: 'Tubing hill at the west end of the Boreal lot.', url: `${BR}/explore/who-we-are/what-to-expect-br/tubing/`, distance: 'At the base' },
      { name: 'Royal Gorge Cross Country', kind: 'nordic', what: 'More than 100 km of groomed nordic trails.', url: royalGorge, distance: '10 min drive' },
      { name: 'Old Town Truckee', kind: 'shop', what: 'Historic downtown with shops, bars and restaurants.', url: 'https://www.truckee.com/', distance: '15 min drive' },
    ],
    apres: [
      { name: 'Hub & Spoke Bar', what: 'Base lodge bar that hosts a spring concert series.', url: `${BR}/explore/facilities/food-and-beverage/` },
      { name: 'Old Town Truckee', what: 'A short drive to a string of bars and restaurants.', url: 'https://www.truckee.com/' },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-11-27', when: 'Nov 27', what: 'Targeted start of the season, conditions permitting.', url: `${BR}/`, confirmed: true },
      { name: 'Spring Concert Series', kind: 'music', date: '2027-03-05', end: '2027-04-02', when: 'Fridays in March (2026 pattern)', what: 'Live music in the Hub & Spoke Bar.', url: `${BR}/explore/community/all-events/`, confirmed: false },
    ],
    getting: { airport: 'Reno-Tahoe International', code: 'RNO', driveMin: 50, from: [{ city: 'Sacramento', hours: 1.5 }, { city: 'San Francisco', hours: 3 }] },
    google: { rating: 4.3, url: cid('108076032755332155'), asOf: ASOF },
    reviewThemes: {
      loved: ['Excellent terrain parks and the Woodward Bunker', 'Night skiing and easy access right off I-80', 'Good for beginners and kids'],
      watchFor: ['Small and short, with little advanced terrain', 'Crowded with lessons and groups on weekends'],
    },
  },
];

export default resorts;
