import type { Resort } from '../types';

const ASOF = '2026-10-02';
const cid = (n: string) => `https://maps.google.com/?cid=${n}`;

const MM = 'https://www.mammothmountain.com';
const JM = 'https://www.junemountain.com';
const BB = 'https://www.bigbearmountainresort.com';
const MH = 'https://www.mthigh.com/site';
const BV = 'https://www.bearvalley.com';
const DR = 'https://dodgeridge.com';
const CP = 'https://www.skichinapeak.com';
const MS = 'https://www.skipark.com';

// Shared lodging and things to do that serve more than one resort.
const villageLodge = `${MM}/plan-your-trip/mammoth-hotels/the-village-lodge`;
const northwoods = 'https://www.northwoodsresort.com/';
const bigBearHostel = 'https://www.bigbearhostel.com/';
const alpineSlide = 'https://alpineslidebigbear.com/';
const bbNyeTorchlight = `${BB}/things-to-do/events/new-years-eve-torchlight-parade`;
const bbHolidays = `${BB}/things-to-do/events/things-to-do-during-the-holidays`;
const bbTickets = `${BB}/ski-and-snowboard/lift-tickets`;
const bbEaster = `${BB}/things-to-do/events/easter-egg-hunt`;

const resorts: Resort[] = [
  {
    id: 'mammoth',
    name: 'Mammoth Mountain',
    region: 'california',
    area: 'Eastern Sierra',
    town: 'Mammoth Lakes, CA',
    coords: [37.6389, -119.0262],
    size: 'major',
    tagline: 'California’s big volcano, often skiing into June',
    summary:
      'California’s highest lift-served peak, with 3,500 acres off an 11,053-ft volcano and a season that typically runs from November into June. Summit chutes, ten terrain parks and two halfpipes keep experts and park riders busy, while The Village has restaurants, bars and a gondola to Canyon Lodge. Snowmobile tours, dog sledding, tubing and the Tamarack cross-country center fill rest days.',
    url: `${MM}/`,
    snowReportUrl: `${MM}/on-the-mountain/mountain-report`,
    trailMapUrl: `${MM}/on-the-mountain/winter-trail-map`,
    webcamUrl: `${MM}/on-the-mountain/mammoth-webcam`,
    passes: ['ikon'],
    season: {
      opens: '2026-11-13',
      closes: '2027-06-06',
      note: 'Opening day Nov 13 is announced. Closing is a tentative early-June target that depends on snow; last season ended June 7.',
    },
    stats: {
      summitFt: 11053, baseFt: 7953, verticalFt: 3100, acres: 3500, trails: 180, lifts: 25,
      snowfallIn: 350, longestRunMi: 3, snowmakingPct: 20,
      terrain: { beginner: 13, intermediate: 48, advanced: 39 },
    },
    ticket: { from: 119, note: '2026–27 online rate on select midweek January dates. Window rates run $149–$269; buying early online saves the most.' },
    activities: ['terrain-park', 'tubing', 'snowmobiling', 'ice-skating', 'scenic-lift', 'snowshoeing', 'nordic', 'dog-sledding', 'mountain-coaster', 'zipline', 'nightlife', 'kids'],
    lodging: [
      { name: 'Juniper Springs Resort', kind: 'ski-in/ski-out', what: 'Family-friendly condos with kitchens and a heated pool at Eagle Lodge, with ski-in, ski-out access.', url: `${MM}/plan-your-trip/mammoth-hotels/juniper-springs-resort`, distance: 'Slopeside at Eagle Lodge' },
      { name: 'Mammoth Mountain Inn', kind: 'slopeside', what: 'Hotel across from Main Lodge and the Panorama Gondola, with a heated pool and the mountain’s activities next door.', url: `${MM}/plan-your-trip/mammoth-hotels/mammoth-mountain-inn`, distance: 'Slopeside at Main Lodge' },
      { name: 'The Village Lodge', kind: 'base village', what: 'Condo-style suites in The Village, steps from shops and restaurants and the gondola up to Canyon Lodge.', url: villageLodge, distance: 'Village Gondola' },
      { name: 'The Westin Monache Resort', kind: 'hotel', what: 'Full-service hotel in The Village, a short walk from the gondola.', url: 'https://www.marriott.com/en-us/hotels/mmhwi-the-westin-monache-resort-mammoth/overview/', distance: 'In The Village' },
      { name: 'Tamarack Lodge', kind: 'lodge', what: 'Historic lodge and cabins in the Lakes Basin, with the cross-country trails right outside.', url: `${MM}/plan-your-trip/mammoth-hotels/tamarack-lodge`, distance: '10 min drive' },
      { name: 'Davison St. Guest House', kind: 'hostel', what: 'A-frame ski chalet that runs as a hostel, with dorm beds, private rooms and a shared kitchen. Hostel bookings open two weeks out.', url: 'https://www.mammoth-guest.com/', distance: 'Walk to Canyon Lodge' },
    ],
    thingsToDo: [
      { name: 'Mammoth Snowmobile Adventures', kind: 'snowmobiling', what: 'Guided snowmobile tours into the Inyo National Forest, run daily by the resort.', url: `${MM}/things-to-do/activities/snowmobile-adventures`, distance: 'Main Lodge' },
      { name: 'Woolly’s Adventure Summit', kind: 'tubing', what: 'Tube park, mountain coaster, zip line and snow play in one spot. An Adventure Pass covers the rides.', url: `${MM}/things-to-do/woollys-adventure-summit`, distance: 'Between The Village and Main Lodge' },
      { name: 'Panorama Gondola scenic ride', kind: 'scenic-lift', what: 'Non-skiers can ride to the 11,053-ft summit for big views across the Sierra.', url: `${MM}/things-to-do/activities/scenic-gondola`, distance: 'Main Lodge' },
      { name: 'Tamarack Cross-Country Ski Center', kind: 'nordic', what: 'More than 19 miles of groomed cross-country and snowshoe trails in the Lakes Basin, with rentals and lessons.', url: `${MM}/things-to-do/activities/tamarack-cross-country-ski-center`, distance: '10 min drive' },
      { name: 'Dog sledding with Mammoth Dog Teams', kind: 'dog-sledding', what: 'Sled-dog rides on the packed trails around town, a nod to the dog teams that carried passengers and freight here in the 1920s.', url: 'https://www.mammothtrails.org/activity/37/dog-sledding/', distance: 'Mammoth Lakes' },
      { name: 'LA Kings Ice at Mammoth Lakes', kind: 'ice-skating', what: 'Indoor Olympic-size rink with daily public skate sessions and rentals, October to April.', url: 'https://www.lakingsicemammothlakes.com/', distance: '10 min drive' },
      { name: 'Mammoth Brewing Company', kind: 'drink', what: 'The town’s brewery, with a tasting room, beer garden and food from The EATery.', url: 'https://mammothbrewingco.com/', distance: '10 min drive' },
    ],
    apres: [
      { name: 'Yodler Restaurant & Bar', what: 'Chalet-style slopeside bar across from Main Lodge, a Mammoth institution.' },
      { name: 'Lincoln Bar', what: 'Ski-in indoor and outdoor bar at Canyon Lodge, where the weekend après parties happen.' },
      { name: 'Clocktower Cellar', what: 'Locals’ pub under the Alpenhof Lodge clock tower, across from the Village Gondola, with a big draft list.', url: 'https://www.clocktowercellar.com/' },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-11-13', when: 'Nov 13, lifts at 8:30 am', what: 'First chairs of the 2026–27 season, conditions permitting.', url: `${MM}/things-to-do/events/opening-day`, confirmed: true },
      { name: 'Holiday Tree Lighting', kind: 'christmas', date: '2026-11-27', when: 'Day after Thanksgiving (annual)', what: 'Santa and Woolly, live music and the first lighting of The Village holiday tree. Free.', url: `${MM}/things-to-do/events/holiday-tree-lighting`, confirmed: false },
      { name: 'Kids Ski Free Week', kind: 'other', date: '2026-12-05', end: '2026-12-11', when: 'Dec 5–11', what: 'Children 12 and under ski free with a $0 ticket reserved online.', url: `${MM}/things-to-do/events/kids-ski-free-week`, confirmed: true },
      { name: 'Night of Lights', kind: 'christmas', date: '2026-12-12', when: 'Dec 12, 5–10 pm', what: 'Holiday celebration at Canyon Lodge with fireworks, live music and kids’ activities.', url: `${MM}/things-to-do/events/night-of-lights`, confirmed: true },
      { name: 'New Year’s Eve in The Village', kind: 'new-years', date: '2026-12-31', when: 'Dec 31, fireworks at 9 pm', what: 'Family-friendly party and fireworks in The Village, timed early so you can still make first chair. New Year’s Eve dinners at the resort’s restaurants.', url: `${MM}/things-to-do/events/new-years-celebration`, confirmed: true },
      { name: 'Pond Skim', kind: 'pond-skim', date: '2027-04-18', when: 'Mid-April (annual)', what: 'Costumed skiers and riders try to cross a 100-ft pond at Canyon Lodge, with an afterparty at Lincoln Bar. Canceled in 2026 for lack of snow.', url: `${MM}/things-to-do/events/annual-pond-skim`, confirmed: false },
    ],
    getting: { airport: 'Eastern Sierra Regional (Bishop)', code: 'BIH', driveMin: 45, from: [{ city: 'Los Angeles', hours: 5 }, { city: 'Reno', hours: 3 }, { city: 'San Francisco', hours: 7 }] },
    google: { rating: 4.7, url: cid('984532572758824468'), asOf: ASOF },
    reviewThemes: {
      loved: ['Deep Sierra snow and huge, varied terrain for every level', 'Terrain parks that rank with the best anywhere', 'Big scenery and a season that keeps going into spring'],
      watchFor: ['A long drive for most visitors, and storms can close the roads', 'Pricey on-mountain food, and crowding when wind shuts key lifts'],
    },
  },
  {
    id: 'june-mountain',
    name: 'June Mountain',
    region: 'california',
    area: 'Eastern Sierra',
    town: 'June Lake, CA',
    coords: [37.7679, -119.0906],
    size: 'mid',
    tagline: 'Mellow family mountain where kids ski free',
    summary:
      'Mammoth’s quiet sister on the June Lake Loop, with about 1,500 acres and a summit at 10,090 ft. Kids 12 and under ski free all season, lift lines are short, and Chair J1 lifts everyone to a mid-mountain chalet to start the day. Stay in tiny June Lake, or drive 30 minutes to Mammoth for more restaurants and nightlife.',
    url: `${JM}/`,
    snowReportUrl: `${JM}/mountain-information/mountain-report`,
    trailMapUrl: `${JM}/mountain-information/trail-map`,
    webcamUrl: `${JM}/mountain-information/live-cams`,
    passes: ['ikon'],
    season: {
      opens: '2026-12-19',
      closes: '2027-04-11',
      note: 'Opening day Dec 19 is announced. Closing is not set; June usually wraps up in mid-April.',
    },
    stats: {
      summitFt: 10090, baseFt: 7545, verticalFt: 2590, acres: 1500, trails: 41, lifts: 6,
      snowfallIn: 250, longestRunMi: 2,
      terrain: { beginner: 15, intermediate: 40, advanced: 45 },
    },
    ticket: { from: 139, note: 'Typical 2026–27 mid-season adult rate. Kids 12 and under ski free all season with a $0 season pass.' },
    activities: ['terrain-park', 'scenic-lift', 'spa', 'kids'],
    lodging: [
      { name: 'Double Eagle Resort and Spa', kind: 'lodge', what: 'Cabins and rooms on the June Lake Loop with a spa and the Eagle’s Landing restaurant.', url: 'https://doubleeagle.com/', distance: '5 min drive' },
      { name: 'Gull Lake Lodge', kind: 'inn', what: 'Classic, cozy motel between Gull Lake and June Lake, a short walk from the village.', url: 'https://www.gulllakelodge.com/', distance: '5 min drive' },
      { name: 'Big Rock Resort', kind: 'cabin', what: 'Lakeside cabins on June Lake in the village.', url: 'https://www.bigrockresort.net/', distance: '5 min drive' },
      { name: 'The Village Lodge (Mammoth)', kind: 'base village', what: 'Stay in Mammoth for more choice and drive up for the day. Ikon and June pass holders get lodging discounts.', url: villageLodge, distance: '30 min drive' },
    ],
    thingsToDo: [
      { name: 'Free naturalist ski tours', kind: 'other', what: 'One-hour weekend tours on skis with a Forest Service naturalist covering geology, wildlife and weather. Intermediate skiers and up.', url: `${JM}/things-to-do/naturalist-tours`, distance: 'Top of Chair J1' },
      { name: 'Guided backcountry tours', kind: 'other', what: 'Off-piste tours with Sierra Mountain Guides into terrain like the Gnome Zone and Carson Peak, starting near the summit.', url: `${JM}/things-to-do/backcountry-tours`, distance: 'From the summit' },
      { name: 'Double Eagle Spa', kind: 'spa', what: 'Massages and soaks after a day on the hill.', url: 'https://doubleeagle.com/', distance: '5 min drive' },
      { name: 'Carson Peak Inn', kind: 'eat', what: 'June Lake dinner staple since 1966, known for hearty portions.', url: 'https://www.carsonpeakinn.com/', distance: '5 min drive' },
      { name: 'Mono Lake Tufa', kind: 'other', what: 'Strange limestone towers on the shore of an ancient salt lake. Striking in winter light.', url: 'https://www.parks.ca.gov/?page_id=514', distance: '20 min drive' },
    ],
    apres: [
      { name: 'Antler Bar', what: 'The bar at the June Meadows Chalet, mid-mountain.' },
      { name: 'Tiger Bar', what: 'Saloon from 1932 with one of the oldest liquor licenses in California, serving bar food with Mexican options.' },
      { name: 'June Lake Brewing', what: 'Small-town brewery taproom with food from La Parrilla.', url: 'https://www.junelakebrewing.com/' },
    ],
    events: [
      { name: 'Opening Day', kind: 'opening', date: '2026-12-19', when: 'Dec 19, J1 opens 7:30 am', what: 'First-chair banner breakthrough at J2 with Bucky the mascot at 8:30 am, then a winter toast at the Chalet.', url: `${JM}/things-to-do/opening-day`, confirmed: true },
      { name: 'Bucky’s Bonfire', kind: 'other', date: '2027-01-09', end: '2027-04-10', when: 'Saturdays, Jan–mid-April, 1:30–3:30 pm', what: 'Free weekly family party at the Chalet with a bonfire, DJ, hot cocoa, games and a group run from the top of J2.', url: `${JM}/things-to-do/buckys-bonfire`, confirmed: false },
      { name: 'Easter Egg Hunt', kind: 'other', date: '2027-03-27', when: 'Saturday before Easter (annual)', what: 'Age-group egg hunts at the Chalet.', url: `${JM}/things-to-do/buckys-bonfire`, confirmed: false },
    ],
    getting: { airport: 'Eastern Sierra Regional (Bishop)', code: 'BIH', driveMin: 65, from: [{ city: 'Reno', hours: 2.75 }, { city: 'Los Angeles', hours: 5.5 }] },
    google: { rating: 4.7, url: cid('12472212706351234861'), asOf: ASOF },
    reviewThemes: {
      loved: ['Hardly any lift lines, even on weekends', 'Free skiing for kids and a relaxed, family-first feel', 'A small, unpretentious town with big views'],
      watchFor: ['Some steeper terrain only opens in big snow years', 'Limited lodge space and quiet evenings in town'],
    },
  },
  {
    id: 'big-bear',
    name: 'Big Bear Mountain Resort',
    region: 'california',
    area: 'San Bernardino Mountains',
    town: 'Big Bear Lake, CA',
    coords: [34.2363, -116.889],
    size: 'mid',
    tagline: 'LA’s weekend snow escape, with night sessions',
    summary:
      'Bear Mountain and Snow Summit sit a few minutes apart in Big Bear Lake and share one ticket (Snow Valley, listed separately, is on it too). Snow Summit has long groomers above the lake and evening Night Sessions; Bear Mountain has the highest lift-served peak in Southern California, the region’s only halfpipes and big parks. A large snowmaking system carries dry spells, and the town has cabins, a walkable village and a New Year’s Eve torchlight parade that dates to 1964.',
    url: `${BB}/`,
    snowReportUrl: `${BB}/mountain-information`,
    trailMapUrl: `${BB}/mountain-information/trail-maps`,
    webcamUrl: `${BB}/webcams`,
    passes: ['ikon'],
    season: {
      opens: '2026-11-21',
      closes: '2027-04-11',
      note: 'Nov 21 is the earliest possible opening (tickets on sale from that date); the real date depends on cold nights for snowmaking. Closing is not set and usually comes in April.',
    },
    stats: {
      summitFt: 8805, baseFt: 7140, verticalFt: 1665, acres: 438, trails: 59, lifts: 17,
      snowfallIn: 100, longestRunMi: 1.5,
      terrain: { beginner: 33, intermediate: 40, advanced: 27 },
    },
    ticket: { from: 105, note: '2026–27 approximate online range $105–$179 for all three mountains. Night Session tickets $59–$109.' },
    activities: ['night-skiing', 'terrain-park', 'tubing', 'mountain-coaster', 'nightlife', 'kids'],
    lodging: [
      { name: 'Snow Summit Townhouses', kind: 'condo', what: 'Individually owned townhouse rentals for up to 10 at the base of Snow Summit.', url: 'https://www.snowsummittownhouses.com/', distance: 'Slopeside at Snow Summit' },
      { name: 'Chateau Big Bear', kind: 'hotel', what: 'Renovated boutique hotel half a mile from Snow Summit, with Tiffany’s Bistro on site.', url: 'https://chateaubigbear.com/', distance: '5 min drive' },
      { name: 'The Lodge at Big Bear Lake (Northwoods Resort)', kind: 'lodge', what: 'Rustic-style hotel on Village Drive with a restaurant and family suites.', url: northwoods, distance: '5 min drive' },
      { name: 'Big Bear Hostel', kind: 'hostel', what: 'Dorm beds and budget private rooms near the lake and village. Reservations required.', url: bigBearHostel, distance: '5 min drive' },
    ],
    thingsToDo: [
      { name: 'Alpine Slide at Magic Mountain', kind: 'mountain-coaster', what: 'Mineshaft Coaster and a snow play hill in town.', url: alpineSlide, distance: '5 min drive' },
      { name: 'Big Bear Snow Play', kind: 'tubing', what: 'Snow tubing, including evening glow tubing, plus go-karts and a ropes course.', url: 'https://bigbearsnowplay.com/', distance: '10 min drive' },
      { name: 'Big Bear Alpine Zoo', kind: 'other', what: 'Small zoo that also takes in injured and orphaned local wildlife.', url: 'https://bigbearzoo.org/', distance: '5 min drive' },
      { name: 'Big Bear Lake Brewing Company', kind: 'drink', what: 'Local brewery in Big Bear Lake for a post-ski pint.', distance: '5 min drive' },
    ],
    apres: [
      { name: 'Laybacks Bar', what: 'Bear Mountain’s sun-deck bar and the center of its après scene.' },
      { name: 'Hog on the Rocks', what: 'At 8,200 ft on top of Snow Summit, the highest bar in Southern California.' },
      { name: 'Tommi’s', what: 'Full-service Snow Summit bar named for founder Tommi Tyndall.' },
      { name: 'Murray’s Saloon & Eatery', what: 'Saloon near the village, open from breakfast until 2 am.', url: 'https://murrayssaloonandeatery.com/' },
    ],
    events: [
      { name: 'Holiday period', kind: 'christmas', date: '2026-12-19', end: '2027-01-03', when: 'Dec 19 – Jan 3', what: 'Extended hours, 8:30 am to 8:30 pm, with daily Night Sessions at Snow Summit and Snow Valley.', url: bbHolidays, confirmed: true },
      { name: 'New Year’s Eve Concert & Torchlight Parade', kind: 'new-years', date: '2026-12-31', when: 'Dec 31, 6–10 pm', what: 'The 62nd annual party at Snow Summit: more than 200 skiers and riders carry torches down the mountain before a (snow)ball drop. Free viewing area.', url: bbNyeTorchlight, confirmed: true },
      { name: 'Bear Bowl XI', kind: 'other', date: '2027-02-13', when: 'Feb 13', what: 'Four-person team contest at Bear Mountain with a relay race, tire course and field-goal kicking. Free to enter; a season pass is the prize.', url: `${BB}/things-to-do/events/bear-bowl`, confirmed: true },
      { name: 'Kids Ski Free Week', kind: 'other', date: '2027-03-15', end: '2027-03-21', when: 'Mar 15–21', what: 'Free lift tickets for kids during the spring break week.', url: bbTickets, confirmed: true },
      { name: 'Easter Egg Hunt', kind: 'other', date: '2027-03-28', when: 'Mar 28, 9–10 am', what: 'Free egg hunts at all three mountains, with a golden egg prize.', url: bbEaster, confirmed: true },
    ],
    getting: { airport: 'Ontario International', code: 'ONT', driveMin: 75, from: [{ city: 'Los Angeles', hours: 2.5 }, { city: 'San Diego', hours: 3 }] },
    google: { rating: 4.5, url: cid('14852736288022845485'), asOf: ASOF },
    reviewThemes: {
      loved: ['Close enough to LA for a day trip or easy weekend', 'Strong terrain parks, especially at Bear Mountain', 'Good lessons for beginners and kids'],
      watchFor: ['Packed slopes, full parking and slow mountain traffic on weekends', 'Mostly machine-made snow that can turn icy or slushy'],
    },
  },
  {
    id: 'mountain-high',
    name: 'Mountain High',
    region: 'california',
    area: 'San Gabriel Mountains',
    town: 'Wrightwood, CA',
    coords: [34.3769, -117.6915],
    size: 'local',
    tagline: 'Closest snow to LA, lit up most nights',
    summary:
      'Southern California’s closest ski area, about 90 minutes from downtown Los Angeles with no winding mountain road. The West Resort has the main terrain park and night skiing until 10 pm in peak season; the East Resort, a mile away, has the longer runs, the Grand View Lodge up top and Yeti’s Snow Play for tubing. Snowmaking covers about 80% of the hill.',
    url: 'https://www.mthigh.com/',
    snowReportUrl: `${MH}/trails-and-conditions/conditions/snow-and-weather-report`,
    trailMapUrl: `${MH}/mountain/mountain-info/interactive-trailmap.html`,
    webcamUrl: `${MH}/mountain/mountain-info/livecams`,
    passes: ['indy'],
    season: {
      opens: '2026-11-27',
      closes: '2027-04-11',
      note: 'Not announced. The resort is usually open mid-November to mid-April, conditions permitting; Yeti’s Snow Play targets Nov 27 and last season opened Nov 24.',
    },
    stats: {
      summitFt: 8200, baseFt: 6600, verticalFt: 1600, acres: 270, trails: 59, lifts: 12,
      snowfallIn: 117, snowmakingPct: 80,
      terrain: { beginner: 25, intermediate: 40, advanced: 35 },
    },
    ticket: { from: 99, note: 'Online Anytime tickets $99–$159; any tickets sold at the resort cost $10 more. Night tickets $69–$89.' },
    activities: ['night-skiing', 'terrain-park', 'tubing', 'scenic-lift', 'kids'],
    lodging: [
      { name: 'Canyon Creek Inn', kind: 'inn', what: 'Comfy, clean small motel in Wrightwood village, among the restaurants and shops.', url: 'https://canyoncreekinn.com/', distance: '10 min drive' },
      { name: 'Grand Pine Cabins', kind: 'cabin', what: 'Renovated bungalows, suites and studios on the site of the old Pines Motel in downtown Wrightwood.', url: 'https://www.grandpinecabins.com/', distance: '10 min drive' },
      { name: 'Wrightwood Vacation Homes', kind: 'cabin', what: 'Locally managed cabin and home rentals, some walkable to town and sleeping up to 12.', url: 'https://www.wrightwoodvacationhomes.com/', distance: '10 min drive' },
    ],
    thingsToDo: [
      { name: 'Yeti’s Snow Play', kind: 'tubing', what: 'Tubing lanes and a sledding area at the East Resort, open mid-November to mid-March.', url: `${MH}/mountain/events-and-activities/yeti-snow-play`, distance: 'East Resort' },
      { name: 'Scenic Sky Chair', kind: 'scenic-lift', what: 'Round-trip chair to the top of the East Resort at 8,000 ft, 11 am–3 pm.', url: `${MH}/mountain/events-and-activities/scenicskychair.html`, distance: 'East Resort' },
      { name: 'Wrightwood village', kind: 'shop', what: 'Small mountain town with cafés, boutiques and the Pacific Crest Trail nearby.', url: 'https://www.wrightwoodchamber.org/', distance: '10 min drive' },
      { name: 'Grizzly Cafe', kind: 'eat', what: 'Café in Wrightwood village, handy for breakfast or lunch on the way to or from the hill.', distance: '10 min drive' },
    ],
    apres: [
      { name: 'Bullwheel Grill', what: 'Warm up by the fireplace at the West Resort base.' },
      { name: 'Grand View Lodge', what: 'Mountaintop dining at the top of the East Resort, with big views.' },
    ],
    events: [
      { name: 'Oktoberfest', kind: 'festival', date: '2026-10-10', end: '2026-10-18', when: 'Oct 10–11 and 17–18', what: 'Pre-season festival with German food, beer, live music and kids’ activities.', url: `${MH}/mountain/events-and-activities/events`, confirmed: true },
      { name: 'Yeti’s Snow Play opens', kind: 'opening', date: '2026-11-27', when: 'Nov 27', what: 'Tubing and sledding open for the winter, conditions permitting.', url: `${MH}/mountain/events-and-activities/yeti-snow-play`, confirmed: true },
    ],
    getting: { airport: 'Ontario International', code: 'ONT', driveMin: 50, from: [{ city: 'Los Angeles', hours: 1.5 }, { city: 'San Diego', hours: 2.5 }] },
    google: { rating: 4.4, url: cid('12649181921835390645'), asOf: ASOF },
    reviewThemes: {
      loved: ['The shortest drive to the snow from LA', 'Gentle terrain and programs that suit beginners', 'Well-built terrain parks with good progression'],
      watchFor: ['Heavy weekend and holiday crowds, with slow exits from the parking lots', 'Thin or wet snow in warm spells'],
    },
  },
  {
    id: 'snow-valley',
    name: 'Snow Valley',
    region: 'california',
    area: 'San Bernardino Mountains',
    town: 'Running Springs, CA',
    coords: [34.225, -117.036],
    size: 'local',
    tagline: 'Rim of the World classic on the Big Bear ticket',
    summary:
      'The oldest of Big Bear Mountain Resort’s three hills, founded in 1937 on Highway 18 at Running Springs and run by the Big Bear team since 2023. It is smaller and cheaper than Snow Summit and Bear Mountain, with its own Snow Valley-only ticket, Night Sessions, a tube park and the Snow Valley Express six-pack. It is the closest of the three to the Inland Empire, which suits beginners, families and short trips.',
    url: `${BB}/`,
    snowReportUrl: `${BB}/mountain-information`,
    trailMapUrl: `${BB}/mountain-information/trail-maps`,
    webcamUrl: `${BB}/webcams`,
    passes: ['ikon'],
    season: {
      opens: '2026-12-04',
      closes: '2027-04-04',
      note: 'Not announced; projected for early December, depending on cold nights for snowmaking. Snow Valley-only tickets go on sale Nov 2. Closing depends on snow.',
    },
    stats: {
      summitFt: 7841, baseFt: 6800, verticalFt: 1041, acres: 240, trails: 32, lifts: 9,
      snowfallIn: 150,
      terrain: { beginner: 14, intermediate: 45, advanced: 41 },
    },
    ticket: { from: 89, note: 'Snow Valley-only ticket, approximately $89–$109 online for 2026–27. The three-mountain ticket runs $105–$179.' },
    activities: ['night-skiing', 'terrain-park', 'tubing', 'scenic-lift', 'kids'],
    lodging: [
      { name: 'Lake Arrowhead Resort & Spa', kind: 'hotel', what: 'Lakeside resort hotel with a private beach, lake-view suites and a spa.', url: 'https://www.lakearrowheadresort.com/', distance: '25 min drive' },
      { name: 'The Lodge at Big Bear Lake (Northwoods Resort)', kind: 'lodge', what: 'Rustic-style hotel in Big Bear Lake, handy if you also want to ski Snow Summit and Bear Mountain.', url: northwoods, distance: '30 min drive' },
      { name: 'Big Bear Hostel', kind: 'hostel', what: 'Dorm beds and budget private rooms near Big Bear’s lake and village.', url: bigBearHostel, distance: '30 min drive' },
    ],
    thingsToDo: [
      { name: 'Snow Valley tube park and snow play', kind: 'tubing', what: 'Tubing lanes and a snow play area at the base for non-skiers and kids.', url: `${BB}/our-mountains`, distance: 'At the base' },
      { name: 'Scenic Sky Chair', kind: 'scenic-lift', what: 'Round-trip chair ride to the top of Snow Valley at 7,841 ft for big views over the San Bernardino National Forest.', url: `${BB}/things-to-do/scenic-sky-chair`, distance: 'At the base' },
      { name: 'Lake Arrowhead Resort spa', kind: 'spa', what: 'Treatments and lakeside lounging on a rest day.', url: 'https://www.lakearrowheadresort.com/', distance: '25 min drive' },
      { name: 'Alpine Slide at Magic Mountain', kind: 'mountain-coaster', what: 'Mineshaft Coaster and a snow play hill in Big Bear Lake.', url: alpineSlide, distance: '30 min drive' },
    ],
    apres: [
      { name: 'Last Run Lounge', what: 'Sports bar in the Snow Valley main lodge with big TVs, cocktails and a slopeside deck.' },
      { name: 'Thunder Mountain BBQ & Bar', what: 'Outdoor bar and grill by the beginner run; dogs on leash welcome.' },
    ],
    events: [
      { name: 'Holiday Night Sessions', kind: 'christmas', date: '2026-12-19', end: '2027-01-03', when: 'Dec 19 – Jan 3', what: 'Extended hours with daily Night Sessions at Snow Valley and Snow Summit through the holiday break.', url: bbHolidays, confirmed: true },
      { name: 'New Year’s Eve Torchlight Parade at Snow Summit', kind: 'new-years', date: '2026-12-31', when: 'Dec 31, 6–10 pm', what: 'The region’s big New Year’s Eve party, 30 minutes east at Snow Summit: a concert, more than 200 torch-carrying skiers and a (snow)ball drop. Free viewing.', url: bbNyeTorchlight, confirmed: true },
      { name: 'Kids Ski Free Week', kind: 'other', date: '2027-03-15', end: '2027-03-21', when: 'Mar 15–21', what: 'Free lift tickets for kids during the spring break week.', url: bbTickets, confirmed: true },
      { name: 'Easter Egg Hunt', kind: 'other', date: '2027-03-28', when: 'Mar 28, 9–10 am', what: 'Free egg hunt at all three Big Bear Mountain Resort hills.', url: bbEaster, confirmed: true },
    ],
    getting: { airport: 'Ontario International', code: 'ONT', driveMin: 50, from: [{ city: 'Los Angeles', hours: 2 }, { city: 'San Diego', hours: 2.5 }] },
    google: { rating: 4.4, url: cid('14361405102129333334'), asOf: ASOF },
    reviewThemes: {
      loved: ['Lower prices and an easygoing, old-school feel', 'A shorter drive than Big Bear from much of the Inland Empire', 'A mix of runs that works for families'],
      watchFor: ['Older chairs that break down now and then', 'Grooming that can be uneven'],
    },
  },
  {
    id: 'bear-valley',
    name: 'Bear Valley',
    region: 'california',
    area: 'Central Sierra',
    town: 'Bear Valley, CA',
    coords: [38.4926, -120.0443],
    size: 'mid',
    tagline: 'Skier-owned Highway 4 mountain with Grizzly Bowl',
    summary:
      'A Central Sierra mountain on Highway 4 with about 1,680 acres, 1,900 ft of vertical and the steep, view-filled Grizzly Bowl. Skier-owned since December 2023, it has upgraded lifts and grooming and added Maury’s Mustang Bar, and it stays far quieter than Tahoe. The historic Bear Valley Lodge and a large cross-country center sit in the village a few minutes down the road.',
    url: `${BV}/`,
    snowReportUrl: `${BV}/conditions-updates`,
    trailMapUrl: `${BV}/trail-map`,
    webcamUrl: `${BV}/webcam`,
    passes: ['indy'],
    season: {
      opens: '2026-11-27',
      closes: '2027-04-04',
      note: 'Not announced; projected for late November. Closing depends on snow; last season ended March 29 after a dry winter.',
    },
    stats: {
      summitFt: 8500, baseFt: 6600, verticalFt: 1900, acres: 1680, trails: 75, lifts: 9,
      snowfallIn: 359, snowmakingPct: 6,
      terrain: { beginner: 25, intermediate: 40, advanced: 35 },
    },
    ticket: { from: 139, note: '2025–26 adult weekday rate. The resort says its best ticket prices are online; 2026–27 rates not yet posted.' },
    activities: ['terrain-park', 'nordic', 'snowshoeing', 'kids'],
    lodging: [
      { name: 'Bear Valley Lodge', kind: 'lodge', what: 'Rustic, historic lodge in Bear Valley village with Sky High Pizza, a general store and pet-friendly rooms. $20 nightly resort fee.', url: `${BV}/lodging`, distance: '5 min drive' },
      { name: 'Arnold Timberline Lodge', kind: 'lodge', what: 'Lodge on Highway 4 in Arnold; a Bear Valley lodging partner.', url: 'https://www.arnoldtimberlinelodge.com/', distance: '35 min drive' },
      { name: 'Black Bear Inn', kind: 'b&b', what: 'Five-room inn on 1.5 acres of gardens and sequoias in Arnold.', url: 'https://www.arnoldblackbearinn.com/', distance: '40 min drive' },
      { name: 'Murphys Historic Hotel', kind: 'hotel', what: 'Gold Rush hotel from 1856 on Main Street in Murphys, near the tasting rooms.', url: 'https://murphyshotel.com/', distance: '55 min drive' },
    ],
    thingsToDo: [
      { name: 'Bear Valley Adventure Company', kind: 'nordic', what: 'About 65 km of groomed skate and classic trails with a trailside café and three warming huts.', url: 'https://www.bvadventures.com/', distance: 'Bear Valley village' },
      { name: 'Calaveras Big Trees State Park', kind: 'snowshoeing', what: 'Giant sequoia groves near Arnold; good for a snowy forest walk on a rest day.', url: 'https://www.parks.ca.gov/?page_id=551', distance: '40 min drive' },
      { name: 'Sky High Pizza', kind: 'eat', what: 'Pizza, salads and a full bar inside Bear Valley Lodge.', url: `${BV}/food-beverage`, distance: 'Bear Valley village' },
      { name: 'Murphys Main Street', kind: 'drink', what: 'Gold Rush town lined with wine tasting rooms, a good stop on the drive down Highway 4.', distance: '55 min drive' },
    ],
    apres: [
      { name: 'Maury’s Mustang Bar', what: 'New slopeside bar honoring the Rasmussen family, with cocktails, wine and draft beer.' },
      { name: 'Monte Wolfe Saloon', what: 'Resort saloon named for a legendary 1930s Mokelumne hermit.' },
      { name: 'Grizzly Lounge', what: 'The bar in the Bear Valley Lodge in the village.' },
    ],
    events: [
      { name: 'Nickolay Dodov Slopestyle & Fundraiser', kind: 'other', date: '2027-03-20', when: 'Mid-to-late March (annual)', what: 'Long-running slopestyle contest and fundraiser; the 10th edition ran in March 2026.', url: `${BV}/conditions-updates`, confirmed: false },
    ],
    getting: { airport: 'Sacramento International', code: 'SMF', driveMin: 165, from: [{ city: 'Sacramento', hours: 2.75 }, { city: 'San Francisco', hours: 3.5 }] },
    google: { rating: 4.4, url: cid('1477148294721994587'), asOf: ASOF },
    reviewThemes: {
      loved: ['Quiet slopes and short lines compared with Tahoe', 'A manageable size with good beginner and intermediate runs', 'Upper-mountain snow that holds up through the season'],
      watchFor: ['Cramped lodge, slow food lines and tight parking on weekends', 'Expert and lower runs need big snow and avalanche work to open'],
    },
  },
  {
    id: 'dodge-ridge',
    name: 'Dodge Ridge',
    region: 'california',
    area: 'Central Sierra',
    town: 'Pinecrest, CA',
    coords: [38.1898, -119.9559],
    size: 'mid',
    tagline: 'Family Sierra hill with the Bay Area’s shortest drive',
    summary:
      'A family-friendly Sierra hill above Pinecrest, open since 1950, with 862 acres, 1,600 ft of vertical and 67 trails. It bills itself as the shortest ski drive from the Bay Area and Central Valley, and it now offers tubing and sledding too. Snowmaking is limited, so the season follows the storms.',
    url: `${DR}/`,
    snowReportUrl: `${DR}/snow-report/`,
    trailMapUrl: `${DR}/trail-maps/`,
    webcamUrl: `${DR}/webcams/`,
    passes: ['indy'],
    season: {
      opens: '2026-12-26',
      closes: '2027-04-04',
      note: 'Not announced; opening depends on natural snow and is projected for late December. Closing depends on snow.',
    },
    stats: {
      summitFt: 8200, baseFt: 6600, verticalFt: 1600, acres: 862, trails: 67, lifts: 10,
      snowfallIn: 350, longestRunMi: 2,
      terrain: { beginner: 25, intermediate: 50, advanced: 25 },
    },
    ticket: { from: 159, note: '2025–26 adult weekday rate. 2026–27 daily prices are not posted yet; online prices vary by date, and a preseason 2-day pack was $199.' },
    activities: ['terrain-park', 'tubing', 'ice-skating', 'kids'],
    lodging: [
      { name: 'Pinecrest Chalet', kind: 'cabin', what: 'Chalets with full kitchens that sleep up to 14, plus cozy cottages and a guest den. Two-night weekend minimum.', url: 'https://pinecrestchalet.com/', distance: '5 min drive' },
      { name: 'Rivers Resort Rentals', kind: 'cabin', what: 'Cabin rentals in Strawberry, a few miles down Highway 108.', url: 'https://riversresortrentals.com/', distance: '10 min drive' },
      { name: 'The Long Barn Lodge', kind: 'lodge', what: 'Retro 20-room motel and 10 cabins in the forest, with an ice rink in winter.', url: 'https://thelongbarnlodge.com/', distance: '20 min drive' },
      { name: 'McCaffrey House', kind: 'b&b', what: 'Bed and breakfast in the pines at Twain Harte.', url: 'https://mccaffreyhouse.com/', distance: '30 min drive' },
      { name: 'Hotel Lumberjack', kind: 'hotel', what: 'Remade Americana motel in historic downtown Sonora, steps from shops and restaurants.', url: 'https://www.hotellumberjack.com/', distance: '45 min drive' },
    ],
    thingsToDo: [
      { name: 'Long Barn Lodge Ice Rink', kind: 'ice-skating', what: 'Winter ice rink at the Long Barn Lodge; last season it closed March 1.', url: 'https://thelongbarnlodge.com/', distance: '20 min drive' },
      { name: 'Pinecrest Lake', kind: 'other', what: 'Snowy shoreline walks around the lake just below the resort.', distance: '5 min drive' },
      { name: 'Columbia State Historic Park', kind: 'museum', what: 'Preserved Gold Rush town with shops, stagecoach and old storefronts.', url: 'https://www.parks.ca.gov/?page_id=552', distance: '50 min drive' },
      { name: 'Historic downtown Sonora', kind: 'shop', what: 'Gold Country main street with shops, restaurants and tasting rooms.', url: 'https://www.visittuolumne.com/things-to-do', distance: '45 min drive' },
    ],
    apres: [
      { name: 'Boulder Bar', what: 'Main bar at the base, pouring local Tuolumne County beer and open to the dining room.' },
      { name: 'The Way Station', what: 'Ski-in mid-mountain stop at 7,000 ft for BBQ burgers, beer and wine.' },
    ],
    events: [
      { name: 'Oktoberfest', kind: 'festival', date: '2026-10-10', end: '2026-10-11', when: 'Oct 10–11', what: 'Live music, shop sales, games, food and drink to kick off the season.', url: `${DR}/events/`, confirmed: true },
      { name: 'Pow-A-Bunga', kind: 'festival', date: '2026-11-14', when: 'Nov 14, 6–10 pm', what: 'Pre-season party at The Armory in downtown Sonora; 1980s neon ski gear encouraged.', url: `${DR}/event/pow-a-bunga-2026/`, confirmed: true },
    ],
    getting: { airport: 'Sacramento International', code: 'SMF', driveMin: 160, from: [{ city: 'Sacramento', hours: 2.5 }, { city: 'San Francisco', hours: 3.25 }] },
    google: { rating: 4.5, url: cid('18228398431384568975'), asOf: ASOF },
    reviewThemes: {
      loved: ['A friendly, family feel with patient staff', 'An easy drive from the Bay Area and Central Valley', 'Well-groomed blue runs'],
      watchFor: ['Not much true expert terrain', 'A crowded lodge at lunch and quiet après'],
    },
  },
  {
    id: 'china-peak',
    name: 'China Peak',
    region: 'california',
    area: 'Central Sierra',
    town: 'Lakeshore, CA',
    coords: [37.2364, -119.1574],
    size: 'mid',
    tagline: 'Uncrowded Sierra slopes above Huntington Lake',
    summary:
      'A mid-size Sierra resort beside Huntington Lake, 65 miles from Fresno, with a summit just over 8,700 ft, 1,679 ft of vertical and one of the larger snowmaking systems in the state. The Inn at China Peak puts rooms steps from the lifts, and lift lines are usually short. Highway 168 from Fresno is the way up and is well maintained in winter.',
    url: `${CP}/`,
    snowReportUrl: `${CP}/conditions`,
    trailMapUrl: `${CP}/trail-map`,
    webcamUrl: `${CP}/webcam/`,
    passes: ['indy'],
    season: {
      opens: '2026-11-27',
      closes: '2027-04-04',
      note: 'Not announced; projected for late November with snowmaking. Closing depends on snow.',
    },
    stats: {
      summitFt: 8709, baseFt: 7030, verticalFt: 1679, acres: 1200, trails: 45, lifts: 9,
      snowfallIn: 300, longestRunMi: 2.25,
      terrain: { beginner: 30, intermediate: 50, advanced: 20 },
    },
    ticket: { from: 119, note: '2025–26 online advance price (as low as $99 early and late season). Resort rate up to $169; 2026–27 prices not yet posted.' },
    activities: ['terrain-park', 'kids'],
    lodging: [
      { name: 'The Inn at China Peak', kind: 'slopeside', what: 'Historic 48-room inn steps from the lifts, with JW’s restaurant and bar. Open Thursday to Sunday nights with a two-night minimum; economy rooms share hall baths.', url: `${CP}/the-inn-at-china-peak`, distance: 'Slopeside', priceFrom: 105, priceNote: '2026–27 non-holiday economy room before tax; holidays from $125' },
      { name: 'Lakeshore Resort', kind: 'cabin', what: 'Renovated cabins on the shore of Huntington Lake with a saloon, restaurant and general store.', url: 'https://www.lakeshoreresort.com/', distance: '5 min drive' },
      { name: 'Shaver Lake Village Hotel', kind: 'hotel', what: 'Small hotel with a restaurant in the town of Shaver Lake.', url: 'https://www.theserenite.com/shaver-lake-village-hotel/', distance: '30 min drive' },
    ],
    thingsToDo: [
      { name: 'JW’s Bar & Grill', kind: 'eat', what: 'Sit-down dinners of steak, fish, pasta and burgers at the Inn, with homemade soups.', url: `${CP}/dining`, distance: 'At the base' },
      { name: 'Lakeshore Resort Saloon', kind: 'drink', what: 'Lakeside saloon in Lakeshore for a drink after the lifts close.', url: 'https://www.lakeshoreresort.com/', distance: '5 min drive' },
      { name: 'Huntington Lake', kind: 'other', what: 'The lake below the resort; quiet, snowy forest walks on a rest day.', url: 'https://huntingtonlake.com/', distance: '5 min drive' },
    ],
    apres: [
      { name: 'Buckhorn Bar & Grill', what: 'Mid-mountain bar at the bottom of Chair 2 with beer on tap and a big screen.' },
      { name: 'JW’s Original Bar', what: 'Cocktails and appetizers at the Inn at China Peak.' },
      { name: 'Sully’s Pub', what: 'Pub at the base Daylodge with the game on the big screen.' },
    ],
    events: [],
    getting: { airport: 'Fresno Yosemite International', code: 'FAT', driveMin: 90, from: [{ city: 'Los Angeles', hours: 4.5 }, { city: 'San Francisco', hours: 4.5 }] },
    google: { rating: 4.4, url: cid('6338908710225217481'), asOf: ASOF },
    reviewThemes: {
      loved: ['Rarely any lift lines', 'Varied terrain without long traverses', 'An affordable day trip from Fresno and the Central Valley'],
      watchFor: ['Slow, older lifts, and not all of them run every day', 'Grooming and staffing can be uneven'],
    },
  },
  {
    id: 'mt-shasta-ski-park',
    name: 'Mt. Shasta Ski Park',
    region: 'california',
    area: 'Shasta Cascade',
    town: 'McCloud, CA',
    coords: [41.3211, -122.2035],
    size: 'local',
    tagline: 'Friendly local hill on the flank of Mount Shasta',
    summary:
      'A small, friendly ski park in far Northern California with 635 acres, 2,036 ft of vertical and twilight skiing on Friday and Saturday evenings. It is the closest lift-served skiing for Redding and the northern Sacramento Valley, with a weekend tubing hill and big views of Mount Shasta. Mt. Shasta Nordic and the park’s own backcountry cabins add quieter options.',
    url: `${MS}/`,
    snowReportUrl: `${MS}/winter/conditions`,
    trailMapUrl: `${MS}/winter/trail-map-stats`,
    passes: ['indy'],
    season: {
      opens: '2026-12-26',
      closes: '2027-03-28',
      note: 'Not announced; opening depends on natural snow and is projected for late December. Closing depends on snow.',
    },
    stats: {
      summitFt: 7536, baseFt: 5500, verticalFt: 2036, acres: 635, trails: 38, lifts: 6,
      snowfallIn: 157, longestRunMi: 2,
      terrain: { beginner: 20, intermediate: 45, advanced: 35 },
    },
    ticket: { from: 99, note: '2025–26 adult weekday rate ($109 weekends). Ticket sales are capped, so buy ahead for weekends.' },
    activities: ['night-skiing', 'terrain-park', 'tubing', 'nordic', 'snowshoeing', 'kids'],
    lodging: [
      { name: 'McCloud Mercantile Hotel', kind: 'hotel', what: 'Boutique hotel in a landmark building on the National Register of Historic Places, in the old mill town of McCloud.', url: 'https://www.mccloudmercantile.com/', distance: '20 min drive' },
      { name: 'Inn at Mount Shasta', kind: 'inn', what: 'Inn in the heart of Mount Shasta city; ask about special rates for Ski Park guests.', url: 'https://www.innatmountshasta.com/', distance: '20 min drive' },
      { name: 'Mount Shasta Resort', kind: 'condo', what: 'Fully equipped chalets in the forest at the edge of Lake Siskiyou; the Ski Park’s preferred lodging partner.', url: 'https://www.mountshastaresort.com/', distance: '25 min drive' },
      { name: 'Best Western Plus Tree House', kind: 'hotel', what: 'Chain hotel at the gateway to Mount Shasta city.', url: 'https://www.bestwestern.com/en_US/book/hotels-in-mount-shasta/best-western-plus-tree-house/propertyCode.05243.html', distance: '20 min drive' },
    ],
    thingsToDo: [
      { name: 'Mt. Shasta Nordic', kind: 'nordic', what: 'Community-run center with 23.5 km of groomed skate and classic trails, a 2.5 km snowshoe loop, rentals and a new lodge.', url: 'https://www.mtshastanordic.org/' },
      { name: 'Backcountry cabins', kind: 'other', what: 'Overnight in two rustic cabins in the Ski Park’s 250-acre backcountry, reached via the Douglas lift and a ski tour. Guided orientation available.', url: `${MS}/backcountry`, distance: 'From the Douglas lift' },
      { name: 'Tubing hill', kind: 'tubing', what: 'Side-by-side tubing lanes on weekends, two-hour sessions with tube included.', url: `${MS}/winter/tubing`, distance: 'At the base' },
      { name: 'Dunsmuir Brewery Works', kind: 'drink', what: 'Small brewpub with house ales and good food in the railroad town of Dunsmuir.', url: 'https://www.dunsmuirbreweryworks.com/', distance: '35 min drive' },
    ],
    apres: [
      { name: 'Ray’s Place Bar & Lounge', what: 'Windowed base-lodge bar with draft beer, local wine and house cocktails.' },
      { name: 'Lemurian Lounge', what: 'Patio bar on top of Douglas Butte with mountain views.' },
    ],
    events: [],
    getting: { airport: 'Redding Regional', code: 'RDD', driveMin: 75, from: [{ city: 'Sacramento', hours: 3.5 }, { city: 'San Francisco', hours: 4.75 }, { city: 'Portland', hours: 5.5 }] },
    google: { rating: 4.5, url: cid('15326833924649347461'), asOf: ASOF },
    reviewThemes: {
      loved: ['Uncrowded slopes, especially midweek and on powder days', 'Big views of Mount Shasta from the lifts', 'Approachable terrain for families and new skiers'],
      watchFor: ['Grooming can be thin, leaving hard-packed runs', 'Some regulars feel prices have risen faster than the experience'],
    },
  },
];

export default resorts;
