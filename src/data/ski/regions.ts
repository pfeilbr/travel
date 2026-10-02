import type { SkiGroup, SkiRegion, SkiRegionId } from './types';

const ots = (slug: string) => `https://www.onthesnow.com/${slug}/skireport`;

export const skiGroups: SkiGroup[] = ['Northeast', 'Rockies', 'Pacific & Southwest', 'Canada'];

export const skiRegions: SkiRegion[] = [
  {
    id: 'vermont', name: 'Vermont', short: 'VT', group: 'Northeast', country: 'US', currency: 'USD',
    tagline: 'The East’s biggest mountains and its best ski towns',
    blurb: 'Route 100 strings together most of the state’s big mountains, from Mount Snow in the south to Jay Peak at the Canadian border. Expect real vertical, covered bridges, inns with wood stoves and some of the best après in the East.',
    center: [43.95, -72.75], zoom: 7,
    gateways: [{ code: 'BTV', name: 'Burlington' }, { code: 'ALB', name: 'Albany' }, { code: 'BOS', name: 'Boston' }],
    reportUrl: 'https://skivermont.com/conditions',
    tips: [
      'Christmas week and Presidents’ Week fill lodging months ahead. Book by early November.',
      'Mid-January is coldest. Pack face protection for lift rides on the big northern mountains.',
      'Route 100 and Route 108 (Smugglers’ Notch) close or slow in storms; Route 108 through the Notch is closed all winter.',
    ],
  },
  {
    id: 'new-hampshire', name: 'New Hampshire', short: 'NH', group: 'Northeast', country: 'US', currency: 'USD',
    tagline: 'White Mountains skiing two hours from Boston',
    blurb: 'Big-mountain skiing in the White Mountains around Lincoln, Franconia and North Conway, plus friendly night-skiing hills closer to Boston. No sales tax, outlet shopping and a long snowmobile trail network.',
    center: [43.95, -71.5], zoom: 7,
    gateways: [{ code: 'MHT', name: 'Manchester' }, { code: 'BOS', name: 'Boston' }, { code: 'PWM', name: 'Portland, ME' }],
    reportUrl: 'https://www.skinh.com/conditions',
    tips: [
      'I-93 makes Loon, Cannon, Waterville and Bretton Woods easy day trips from Boston.',
      'Mount Washington Valley (North Conway) is the base for Cranmore, Attitash, Wildcat, Black and King Pine.',
      'Cannon and Wildcat sit in notches that catch wind. Check lift status on cold days.',
    ],
  },
  {
    id: 'new-york', name: 'New York', short: 'NY', group: 'Northeast', country: 'US', currency: 'USD',
    tagline: 'Olympic Adirondacks, Catskills and lake-effect powder',
    blurb: 'Whiteface and Gore anchor the Adirondacks, the Catskills are the closest big skiing to New York City, and Central and Western New York hills get lake-effect snow and night skiing a short drive from Syracuse, Rochester and Buffalo.',
    center: [42.9, -75.3], zoom: 6,
    gateways: [{ code: 'ALB', name: 'Albany' }, { code: 'SYR', name: 'Syracuse' }, { code: 'BUF', name: 'Buffalo' }],
    reportUrl: ots('new-york'),
    tips: [
      'Lake-effect bands off Ontario and Erie can drop a foot on Tug Hill or Ellicottville while Syracuse stays dry.',
      'Gore, Whiteface and Belleayre are state-run (ORDA) and share deals like the Ski3 pass.',
      'Many Central New York hills ski at night, so an after-work session is easy.',
    ],
  },
  {
    id: 'pennsylvania', name: 'Pennsylvania', short: 'PA', group: 'Northeast', country: 'US', currency: 'USD',
    tagline: 'Poconos waterparks and Laurel Highlands night skiing',
    blurb: 'The Poconos are a family winter weekend from New York and Philadelphia, with indoor waterparks and tubing next to the slopes. Out west, the Laurel Highlands get the most natural snow in the state.',
    center: [40.9, -77.4], zoom: 7,
    gateways: [{ code: 'PHL', name: 'Philadelphia' }, { code: 'PIT', name: 'Pittsburgh' }, { code: 'AVP', name: 'Wilkes-Barre/Scranton' }],
    reportUrl: ots('pennsylvania'),
    tips: [
      'Weeknight skiing is the local way to go: most mountains run lights until 9 or 10 pm.',
      'Snowmaking does the heavy lifting here. Conditions are best after a cold snap.',
      'Holiday weeks and MLK weekend are the busiest days of the year.',
    ],
  },
  {
    id: 'utah', name: 'Utah', short: 'UT', group: 'Rockies', country: 'US', currency: 'USD',
    tagline: 'The Greatest Snow on Earth, 40 minutes from the airport',
    blurb: 'Light, dry Wasatch powder and ten-plus resorts within an hour of Salt Lake City’s airport. Park City is the town, the Cottonwood Canyons are the deep snow, and Ogden Valley is the quiet side.',
    center: [40.5, -111.7], zoom: 7,
    gateways: [{ code: 'SLC', name: 'Salt Lake City' }],
    reportUrl: 'https://www.skiutah.com/snowreport',
    tips: [
      'Little and Big Cottonwood Canyon roads close during storms for avalanche control. Leave early and check UDOT Cottonwoods.',
      'Snow tires or chains are required in the canyons when traction laws are in effect.',
      'Alta and Deer Valley are skiers only. No snowboards.',
    ],
  },
  {
    id: 'colorado', name: 'Colorado', short: 'CO', group: 'Rockies', country: 'US', currency: 'USD',
    tagline: 'High-altitude resorts and real mountain towns',
    blurb: 'The I-70 corridor puts Vail, Breckenridge, Keystone and a dozen more within two hours of Denver. Farther out, Aspen, Steamboat, Telluride and Crested Butte trade convenience for character and smaller crowds.',
    center: [39.2, -106.4], zoom: 7,
    gateways: [{ code: 'DEN', name: 'Denver' }, { code: 'EGE', name: 'Eagle/Vail' }, { code: 'ASE', name: 'Aspen' }, { code: 'HDN', name: 'Hayden/Steamboat' }],
    reportUrl: 'https://www.coloradoski.com/snow-report',
    tips: [
      'Weekend I-70 traffic is notorious. Drive up before 7 am or stay over.',
      'Altitude is real: most bases sit above 9,000 ft. Hydrate and take the first day easy.',
      'Colorado’s traction law can require snow tires or chains on I-70 in storms.',
    ],
  },
  {
    id: 'montana', name: 'Montana', short: 'MT', group: 'Rockies', country: 'US', currency: 'USD',
    tagline: 'Big Sky terrain and no lift lines',
    blurb: 'Big Sky is one of the largest ski areas in the country, Whitefish sits above a lively railroad town near Glacier, and a string of locals’ hills offer cheap tickets and empty runs.',
    center: [46.5, -112.0], zoom: 6,
    gateways: [{ code: 'BZN', name: 'Bozeman' }, { code: 'FCA', name: 'Kalispell–Glacier' }, { code: 'MSO', name: 'Missoula' }],
    reportUrl: ots('montana'),
    tips: [
      'January cold snaps can drop below zero. Check the forecast and pack for it.',
      'Bozeman’s airport has the most nonstop flights; Big Sky is about an hour south.',
      'Yellowstone snowmobile and snowcoach tours leave from West Yellowstone, about 1 hr from Big Sky.',
    ],
  },
  {
    id: 'california', name: 'California & Tahoe', short: 'CA', group: 'Pacific & Southwest', country: 'US', currency: 'USD',
    tagline: 'Sierra storms, lake views and a season into spring',
    blurb: 'Lake Tahoe has more big resorts around one lake than anywhere in the country, Mammoth runs one of the longest seasons in North America, and Southern California’s mountains put skiing two hours from Los Angeles.',
    center: [38.0, -119.8], zoom: 6,
    gateways: [{ code: 'RNO', name: 'Reno-Tahoe' }, { code: 'SMF', name: 'Sacramento' }, { code: 'MMH', name: 'Mammoth' }, { code: 'LAX', name: 'Los Angeles' }],
    reportUrl: ots('california'),
    tips: [
      'Sierra storms can be huge. Carry chains; Caltrans enforces chain controls on I-80 and US-50.',
      'Spring is a highlight: sunny groomers, long days and Mammoth often open into summer.',
      'Reno is often easier to fly into for Tahoe than the Bay Area.',
    ],
  },
  {
    id: 'arizona', name: 'Arizona', short: 'AZ', group: 'Pacific & Southwest', country: 'US', currency: 'USD',
    tagline: 'Ski in the morning, desert by dinner',
    blurb: 'Arizona Snowbowl on the San Francisco Peaks above Flagstaff is the state’s real mountain, with long runs and big views. Smaller hills in the White Mountains and above Tucson open when the storms cooperate.',
    center: [34.2, -111.3], zoom: 7,
    gateways: [{ code: 'FLG', name: 'Flagstaff' }, { code: 'PHX', name: 'Phoenix' }, { code: 'TUS', name: 'Tucson' }],
    reportUrl: ots('arizona'),
    tips: [
      'Seasons swing a lot with storm tracks. Check opening status before you drive.',
      'Flagstaff is 2 hours from Phoenix and 90 minutes from the Grand Canyon’s South Rim.',
      'Sunny days at 11,000 ft burn. Wear sunscreen even in January.',
    ],
  },
  {
    id: 'quebec', name: 'Québec', short: 'QC', group: 'Canada', country: 'CA', currency: 'CAD',
    tagline: 'French-Canadian ski villages near Montréal and Québec City',
    blurb: 'Tremblant’s car-free village anchors the Laurentians north of Montréal, the Eastern Townships hills sit just over the Vermont border, and Québec City’s mountains add river views and Carnaval in February.',
    center: [46.2, -73.0], zoom: 7,
    gateways: [{ code: 'YUL', name: 'Montréal' }, { code: 'YQB', name: 'Québec City' }],
    reportUrl: ots('quebec'),
    tips: [
      'Prices are in Canadian dollars, which usually stretches a US budget.',
      'Winter tires are mandatory in Québec from Dec 1 to Mar 15; rentals include them.',
      'Bring a passport. Owl’s Head and Sutton are 15 minutes from the Vermont border.',
    ],
  },
  {
    id: 'british-columbia', name: 'British Columbia', short: 'BC', group: 'Canada', country: 'CA', currency: 'CAD',
    tagline: 'Whistler, the Powder Highway and cat-skiing country',
    blurb: 'Whistler Blackcomb is the biggest resort in North America, Vancouver’s North Shore hills ski at night above the city, and the Interior’s Powder Highway links Revelstoke, Fernie and Kicking Horse with cat and heli skiing in between.',
    center: [50.3, -120.5], zoom: 6,
    gateways: [{ code: 'YVR', name: 'Vancouver' }, { code: 'YLW', name: 'Kelowna' }, { code: 'YYC', name: 'Calgary' }],
    reportUrl: ots('british-columbia'),
    tips: [
      'Prices are in Canadian dollars.',
      'Winter tires or chains are required on most BC highways Oct 1 to Mar 31, including the Sea to Sky to Whistler.',
      'Interior snow is drier than the coast. Revelstoke and Fernie often have the deepest days.',
    ],
  },
];

export const skiRegionById = Object.fromEntries(skiRegions.map((r) => [r.id, r])) as Record<SkiRegionId, SkiRegion>;
