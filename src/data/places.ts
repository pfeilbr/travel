import type { Place } from './types';

const ASOF = '2026-10-07';
const cid = (n: string) => `https://maps.google.com/?cid=${n}`;
const ra = (slug: string, id: number) =>
  `https://newyorkstateparks.reserveamerica.com/camping/${slug}/r/campgroundDetails.do?contractCode=NY&parkId=${id}`;

const ithaca: Place['nearby'] = {
  title: 'Nearby in Ithaca',
  note: 'Mondays are quiet in Ithaca and many restaurants close, so do the big dinner on Sunday.',
  items: [
    { name: 'Gorge Trail, Enfield Glen', kind: 'hike', what: '1.5 mi past 12 waterfalls including 115-ft Lucifer Falls. Great Monday morning before 11 am checkout.', distance: 'In Treman', url: 'https://ithacatrails.org/trail/robert-h-treman-gorge-trail/' },
    { name: 'Buttermilk Falls State Park', kind: 'hike', what: 'Cascades right off Route 13, with a short gorge walk.', distance: '~5 min' },
    { name: 'Taughannock Falls', kind: 'hike', what: '215-ft plunge falls, an easy flat walk on the way north.', distance: '~25 min' },
    { name: 'Cayuga Waterfront Trail', kind: 'bike', what: '6 flat, paved miles linking Stewart Park, the Farmers Market and Cass Park.', distance: '~15 min', url: 'https://www.visitithaca.com/blog/post/bike-paths-in-ithaca/' },
    { name: 'Black Diamond Trail', kind: 'bike', what: '8.4 mi stone-dust rail trail from Cass Park to Taughannock.', distance: '~15 min', url: 'https://parks.ny.gov/visit/state-parks/black-diamond-trail' },
    { name: 'Cayuga Lake shore', kind: 'fish', what: 'Bank access at Allan H. Treman Marine Park and Stewart Park. NY license required.', distance: '~15 min' },
    { name: 'Ithaca Farmers Market', kind: 'shop', what: 'Steamboat Landing, Sundays 10 am–3 pm in season. Confirm Oct 4.', distance: '~15 min', url: 'https://www.visitithaca.com/things-to-do/shopping/farmers-markets/' },
    { name: 'Moosewood', kind: 'eat', what: 'The landmark vegetarian restaurant. Sundays 5–9 pm.', distance: '~15 min', url: 'https://opentable.com/r/moosewood' },
    { name: 'Monks on the Commons', kind: 'eat', what: 'Open Sundays until 11 pm, steps from the Commons.', distance: '~15 min', url: 'https://joinpearl.co/restaurants/ithaca/monks-on-the-commons' },
    { name: 'Ithaca Beer Co.', kind: 'drink', what: 'Taproom and food. Check hours.', distance: '~5 min' },
    { name: 'Ithaca Commons', kind: 'do', what: 'Pedestrian downtown for an after-dinner walk.', distance: '~15 min' },
  ],
};

export const places: Place[] = [
  {
    id: 'green-lakes', name: 'Green Lakes State Park', town: 'Fayetteville', region: 'Central New York', kind: 'State park',
    tagline: 'Turquoise glacial lakes 30 minutes from home',
    summary: 'Two rare meromictic lakes with startling blue-green water, a loop trail around both, mountain-bike trails and trout fishing, plus Syracuse restaurants a short drive away.',
    activities: ['biking', 'fishing', 'hiking', 'kayaking', 'restaurants', 'foliage'],
    lodging: ['tent', 'cabin'], coords: [43.0582, -75.9715],
    google: { rating: 4.8, reviews: 7900, url: cid('2048549156781711171'), asOf: ASOF },
    reviewThemes: {
      loved: ['The water color is the headline, often described as unreal', 'The walk around Green Lake is easy and gorgeous', 'Kayak rentals and an extensive trail network'],
      watchFor: ['The beach and lake loop get crowded on nice days'],
    },
    booking: { label: 'ReserveAmerica', url: ra('green-lakes-state-park', 165) },
  },
  {
    id: 'verona-beach-state-park', name: 'Verona Beach State Park', town: 'Verona Beach', region: 'Central New York', kind: 'State park',
    tagline: 'Oneida Lake beach and sunsets 17 minutes from home',
    summary: 'A sandy swimming beach and splash pad on the east shore of Oneida Lake, 47 electric campsites (11 on the water), 14 miles of flat woods-and-wetland trails, walleye fishing and a launch for kayaks, with Sylvan Beach next door and Turning Stone 15 minutes away.',
    activities: ['swimming', 'fishing', 'hiking', 'biking', 'kayaking', 'nightlife', 'restaurants'],
    lodging: ['tent'], coords: [43.1767, -75.7293], seasonEnds: '2026-10-12',
    google: { rating: 4.6, reviews: 1449, url: cid('1924360593672905752'), asOf: '2026-10-10' },
    reviewThemes: {
      loved: ['The shallow, sandy beach and splash pad make it an easy family day', 'Sunsets over Oneida Lake', 'Flat, paved trails that anyone can walk or roll', 'Teddy’s Treats concession for fries and ice cream'],
      watchFor: ['Algae blooms can close the beach in late summer', 'Sites have electric only, no water or sewer, and some are tight for big trailers', 'Occasional odor near the restroom and splash pad'],
    },
    booking: { label: 'ReserveAmerica', url: ra('verona-beach-state-park', 170) },
    phone: '315-762-4463',
    nearby: {
      title: 'Nearby at Sylvan Beach',
      note: 'Sylvan Beach winds down after Labor Day, and Eddie’s usually closes for the season in early October, so check before you go.',
      items: [
        { name: 'Woods and Wetland nature trail', kind: 'hike', what: 'The park’s signature loop, part of 14 miles of flat trails through wetlands and woods, open year-round.', distance: 'In the park', url: 'https://parks.ny.gov/parks/veronabeach/maps.aspx' },
        { name: 'Oneida Lake', kind: 'fish', what: 'One of the state’s best walleye lakes, plus bass and perch. Shore access in the park; the launch is for non-motorized boats only. NY license required.', distance: 'In the park' },
        { name: 'Sylvan Beach pier and boardwalk', kind: 'do', what: 'Walk the canal-side pier and the beach where the Erie Canal meets Oneida Lake.', distance: '~5 min' },
        { name: 'Eddie’s Restaurant', kind: 'eat', what: 'The Sylvan Beach institution since 1934, which started as a hot dog stand. Seasonal.', distance: '~5 min', url: 'https://sylvanbeachny.com/eddies/' },
        { name: 'Harpoon Eddie’s', kind: 'drink', what: 'Lakefront bar and deck for a sunset drink. Seasonal.', distance: '~5 min', url: 'https://sylvanbeachny.com/harpoon-eddies-2/' },
        { name: 'Turning Stone Resort Casino', kind: 'do', what: 'Casino, restaurants, shows and golf, back toward Verona.', distance: '~15 min', url: 'https://www.turningstone.com/' },
      ],
    },
  },
  {
    id: 'selkirk-shores', name: 'Selkirk Shores State Park', town: 'Pulaski', region: 'Lake Ontario', kind: 'State park',
    tagline: 'Lake Ontario sunsets and the Salmon River run',
    summary: 'Campsites and cabins on a bluff over Lake Ontario, a short drive from the Salmon River, where the fall salmon run peaks in early October.',
    activities: ['fishing', 'swimming', 'hiking', 'kayaking'],
    lodging: ['tent', 'cabin'], coords: [43.5531, -76.2056], seasonEnds: '2026-10-24',
    google: { rating: 4.5, reviews: 1337, url: cid('3028196866094056512'), asOf: ASOF },
    reviewThemes: {
      loved: ['Campground and cabins were remodeled in 2025', 'Clean washrooms and helpful staff and rangers', 'Sunsets over the lake'],
      watchFor: ['Some campers say there are too few showers for the number of sites'],
    },
    booking: { label: 'ReserveAmerica', url: ra('selkirk-shores-state-park', 82) },
  },
  {
    id: 'glimmerglass', name: 'Glimmerglass State Park', town: 'Cooperstown', region: 'Leatherstocking', kind: 'State park',
    tagline: 'Otsego Lake, Hyde Hall and a bike ride to Cooperstown',
    summary: 'A quiet shoulder-season park on Otsego Lake with a beach, trails, the historic Hyde Hall mansion and covered bridge, and Cooperstown restaurants and breweries nearby.',
    activities: ['biking', 'hiking', 'history', 'swimming', 'restaurants', 'foliage'],
    lodging: ['tent'], coords: [42.7862, -74.8646], seasonEnds: '2026-10-12',
    google: { rating: 4.7, reviews: 1603, url: cid('11762924941079340335'), asOf: ASOF },
    reviewThemes: {
      loved: ['Spring and fall are nearly empty and peaceful', 'Well-kept grounds and clean bathrooms', 'A three-in-one visit: beach, Hyde Hall tour and trails'],
      watchFor: ['Noise from groups on busy summer days'],
    },
    booking: { label: 'ReserveAmerica', url: ra('glimmerglass-state-park', 78) },
  },
  {
    id: 'nicks-lake', name: 'Nicks Lake Campground', town: 'Old Forge', region: 'Adirondacks', kind: 'DEC campground',
    tagline: 'Adirondack lake loop at peak foliage',
    summary: 'A quiet DEC campground on a no-motor lake with a loop trail, paddling and bike trails into Old Forge. Early October is prime leaf season up here.',
    activities: ['biking', 'hiking', 'kayaking', 'fishing', 'foliage'],
    lodging: ['tent'], coords: [43.6744, -74.9869], seasonEnds: '2026-10-11',
    google: { rating: 4.8, reviews: 339, url: cid('9913899975042193144'), asOf: ASOF },
    reviewThemes: {
      loved: ['Reviewers call it one of the best-kept state campgrounds', 'An easy, beautiful hike around the lake', 'Kayaking in autumn, and you can bike into Old Forge'],
      watchFor: ['No motorboats, which most people count as a plus', 'Colder nights than the Finger Lakes'],
    },
    booking: { label: 'ReserveAmerica', url: ra('nicks-lake-campground', 699) },
  },
  {
    id: 'sampson', name: 'Sampson State Park', town: 'Romulus', region: 'Finger Lakes', kind: 'State park',
    tagline: 'Big Seneca Lake park with a marina and wineries nearby',
    summary: 'A large park on Seneca Lake with a marina, lake-trout fishing, bike-friendly loops, a museum and Seneca Lake wineries close by.',
    activities: ['fishing', 'biking', 'swimming', 'wineries', 'history'],
    lodging: ['tent', 'cottage', 'cabin'], coords: [42.7231, -76.9015], seasonEnds: '2026-10-11',
    google: { rating: 4.6, reviews: 1798, url: cid('12136717719055424683'), asOf: ASOF },
    reviewThemes: {
      loved: ['Clean, spacious, fairly level sites', 'Good for biking, with eagles overhead', 'Beach, mini golf and a camp store'],
      watchFor: ['Sites are open with little shade', 'Many sites have no lake view', 'Power pedestals are dated, so bring a long extension cord'],
    },
    booking: { label: 'ReserveAmerica', url: ra('sampson-state-park', 232) },
    phone: '315-651-4949',
  },
  {
    id: 'firelight-camps', name: 'Firelight Camps', town: 'Ithaca', region: 'Finger Lakes', kind: 'Glamping',
    tagline: 'Safari-tent glamping next to Buttermilk Falls',
    summary: 'Furnished safari tents on wooded grounds behind La Tourelle, with a lobby-tent bar, campfires, and private shower rooms. Ithaca food and nightlife are minutes away.',
    activities: ['hiking', 'waterfalls', 'restaurants', 'nightlife', 'wineries'],
    lodging: ['glamping'], coords: [42.4014, -76.5049],
    google: { rating: 4.6, reviews: 184, url: cid('14599637436372689369'), asOf: ASOF },
    reviewThemes: {
      loved: ['Comfortable beds and spacious tents', 'Secluded and quiet even though it sits behind an inn', 'Private shower rooms, which wins over first-time glampers'],
      watchFor: ['Only tents 16–19 have heaters, and October nights get cold'],
    },
    booking: { label: 'firelightcamps.com', url: 'https://secure.webrez.com/hotel/1454' },
    phone: '607-229-1644',
    nearby: ithaca,
  },
  {
    id: 'robert-h-treman', name: 'Robert H. Treman State Park', town: 'Ithaca', region: 'Finger Lakes', kind: 'State park',
    tagline: '12 waterfalls, rustic cabins, 10 minutes to Ithaca',
    summary: 'The Enfield Glen gorge trail passes 12 waterfalls including 115-ft Lucifer Falls. Electric, heated cabins and wooded campsites sit minutes from Ithaca restaurants and bars.',
    activities: ['hiking', 'waterfalls', 'biking', 'fishing', 'restaurants', 'nightlife', 'foliage'],
    lodging: ['tent', 'cabin'], coords: [42.3993, -76.5695], seasonEnds: '2026-11-07',
    google: { rating: 4.8, reviews: 4417, url: cid('15210717506554966108'), asOf: ASOF },
    reviewThemes: {
      loved: ['Gorge and waterfalls around every corner', 'The 5-mile loop is a real workout but very doable', 'Cabins are clean, with electricity and a fridge'],
      watchFor: ['Cabins have no stove, microwave or running water', 'Some steep, slippery stretches on the trail'],
    },
    booking: { label: 'ReserveAmerica', url: ra('robert-h-treman-state-park', 221) },
    phone: '607-273-3440',
    cabinDetails: {
      inside: '1 room: 2 single cots + 2 bunk beds (mattresses, sleeps 4), refrigerator, electric baseboard heat, outlets. No water, no stove.',
      outside: 'Open porch, fire pit, grill, picnic table. Full shade. Gravel drive-in, 2 vehicles, 20 ft max.',
      bring: 'Sheets or sleeping bags, pillows, towels, cookware and utensils, water jugs, a camp stove.',
      rules: 'Check-in 3 pm, check-out 11 am. No smoking, no portable heaters, no tents in the cabin area. Comfort stations have toilets and showers. Up to 2 pets with a paper rabies certificate.',
    },
    nearby: ithaca,
  },
  {
    id: 'keuka-lake', name: 'Keuka Lake State Park', town: 'Bluff Point', region: 'Finger Lakes', kind: 'State park',
    tagline: 'Quiet Y-shaped lake on the wine trail',
    summary: 'Large, fairly private wooded sites, a boat launch and bass fishing on Keuka Lake, with the Keuka Lake wine trail at your doorstep.',
    activities: ['fishing', 'kayaking', 'swimming', 'wineries', 'foliage'],
    lodging: ['tent'], coords: [42.5911, -77.1307], seasonEnds: '2026-10-11',
    google: { rating: 4.7, reviews: 1161, url: cid('3187840499731011468'), asOf: ASOF },
    reviewThemes: {
      loved: ['Large sites with trees between them for privacy', 'Clean bathrooms and friendly staff', 'Lovely in the fall'],
      watchFor: ['Rocky beach, so bring water shoes', 'Some loops, notably Deer, get muddy for tents after rain'],
    },
    booking: { label: 'ReserveAmerica', url: ra('keuka-lake-state-park', 228) },
  },
  {
    id: 'watkins-glen', name: 'Watkins Glen State Park', town: 'Watkins Glen', region: 'Finger Lakes', kind: 'State park',
    tagline: 'The famous 19-waterfall gorge',
    summary: 'New York’s most famous gorge, with 19 waterfalls along a stone-stair trail, a campground on the rim, and Watkins Glen village restaurants on Seneca Lake.',
    activities: ['hiking', 'waterfalls', 'restaurants', 'wineries', 'foliage'],
    lodging: ['tent', 'cabin'], coords: [42.3672, -76.9016], seasonEnds: '2026-10-11',
    google: { rating: 4.8, reviews: 24029, url: cid('9161238026903819998'), asOf: ASOF },
    reviewThemes: {
      loved: ['The gorge trail and waterfalls are spectacular', 'The suspension bridge and Rainbow Falls', 'It connects to the Finger Lakes Trail'],
      watchFor: ['Very busy, and the gorge trail can be one-way and crowded', 'Wet, slippery steps'],
    },
    booking: { label: 'ReserveAmerica', url: ra('watkins-glen-state-park', 254) },
  },
  {
    id: 'moreau-lake', name: 'Moreau Lake State Park', town: 'Gansevoort', region: 'Capital Region', kind: 'State park',
    tagline: 'Sandy-beach lake 15 minutes from Saratoga',
    summary: 'A lake with sandy beaches, a nature center and Hudson River ridge trails, plus Saratoga Springs restaurants and nightlife 15 minutes away.',
    activities: ['hiking', 'kayaking', 'fishing', 'swimming', 'nightlife', 'restaurants'],
    lodging: ['tent', 'cabin', 'cottage'], coords: [43.2389, -73.7301], seasonEnds: '2026-11-28',
    google: { rating: 4.6, reviews: 2228, url: cid('7674911075965216121'), asOf: ASOF },
    reviewThemes: {
      loved: ['Roomy sites with vegetation for privacy', 'Sandy beach, a nature center and lots of trails', 'Good value'],
      watchFor: ['No hookups at the sites', 'Some longtime visitors say the lake shows signs of neglect'],
    },
    booking: { label: 'ReserveAmerica', url: ra('moreau-lake-state-park', 311) },
  },
];

export const placeById = Object.fromEntries(places.map((p) => [p.id, p])) as Record<string, Place>;
