import imgTradescantia from '../assets/images/regenerated_image_1791652222625.jpg';
import imgCissus from '../assets/images/specimen_cissus_quadrangularis_1791645668185.jpg';
import imgIndianAlmond from '../assets/images/photo_indian_almond_1791647910384.jpg';
import imgBridalBouquet from '../assets/images/photo_bridal_bouquet_1791647922991.jpg';
import imgThuja from '../assets/images/photo_thuja_1791647934802.jpg';
import imgBuddhistPine from '../assets/images/photo_buddhist_pine_1791647945499.jpg';
import imgSilverWattle from '../assets/images/photo_silver_wattle_1791647955949.jpg';
import imgHalfFlower from '../assets/images/regenerated_image_1791652259328.png';
import imgRoseOfSharon from '../assets/images/regenerated_image_1791652262297.png';
import imgSpiderPlant from '../assets/images/regenerated_image_1791652265666.png';
import imgTeamDefault from '../assets/images/team_golden_leaf_expedition_1791645644802.jpg';

export interface GeotagData {
  locationTitle: string;
  address: string;
  lat: number;
  lng: number;
  latDisplay: string;
  lngDisplay: string;
  timestamp: string;
  overlayPosition: 'top' | 'bottom';
}

export interface NativeOriginData {
  regionName: string;
  continent: string;
  lat: number;
  lng: number;
  rangeRadiusDeg: number;
  climateZone: string;
  biogeographySummary: string;
}

export interface HerbariumSpecimen {
  id: string;
  entryNumber: string;
  /** Heading matches the exact uploaded file name (Plant Common Name) */
  commonName: string;
  fileName: string;
  alternateNames: string[];
  taxonomy: {
    kingdom: string;
    order: string;
    family: string;
    genus: string;
    species: string;
    scientificName: string;
    authority: string;
  };
  characteristics: string;
  leafMorphologyDetails: string;
  uses: string[];
  usesSummary: string;
  useCategory: 'Medicinal' | 'Ornamental & Hedges' | 'Air Purification' | 'Ecological & Timber';
  geotag: GeotagData;
  nativeOrigin: NativeOriginData;
  defaultImageUrl: string;
  accentColor: string;
}

export interface TeamMember {
  id: string;
  index: number;
  name: string;
  role: string;
  contribution: string;
  /** Normalized x,y coordinates (0-100) on the group photo for interactive hotspot alignment */
  photoSpot: { x: number; y: number };
}

export const DEFAULT_TEAM_PHOTO = imgTeamDefault;

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'rudraksh-kushwah',
    index: 1,
    name: 'Rudraksh Kushwah',
    role: 'Field Collector',
    contribution:
      'Led on-site botanical reconnaissance across Kushwaha Nagar and Banganga in Indore, locating healthy living specimens and recording GPS coordinates.',
    photoSpot: { x: 14, y: 38 },
  },
  {
    id: 'vedanshi-vyas',
    index: 2,
    name: 'Vedanshi Vyas',
    role: 'Plant Preservation',
    contribution:
      'Managed pressing, drying, moisture control, and morphological conservation of all 10 leaf and stem specimens.',
    photoSpot: { x: 28, y: 42 },
  },
  {
    id: 'dolly-thakur',
    index: 3,
    name: 'Dolly Thakur K.',
    role: 'Creative Director & File Decorator',
    contribution:
      'Directed the visual aesthetic, Golden Leaf theme, layout composition, and handcrafted callout taxonomy tags for the herbarium portfolio.',
    photoSpot: { x: 43, y: 41 },
  },
  {
    id: 'shikha-madariya',
    index: 4,
    name: 'Shikha Madariya',
    role: 'Scientific Writing',
    contribution:
      'Researched binomial nomenclature, botanical orders, families, and diagnostic foliar characteristics for each entry.',
    photoSpot: { x: 58, y: 43 },
  },
  {
    id: 'rupali-yadav',
    index: 5,
    name: 'Rupali Yadav',
    role: 'Report Writer',
    contribution:
      'Compiled ethnobotanical uses, ecological profiles, and structured field documentation across the 10-species collection.',
    photoSpot: { x: 74, y: 44 },
  },
  {
    id: 'umang-rajak',
    index: 6,
    name: 'Umang Rajak',
    role: 'Sheet Assembly',
    contribution:
      'Executed final herbarium sheet mounting, geotag photo organization, and archival indexing of the complete specimen dossier.',
    photoSpot: { x: 88, y: 40 },
  },
];

export const HERBARIUM_SPECIMENS: HerbariumSpecimen[] = [
  {
    id: 'inch-plant',
    entryNumber: '01',
    commonName: 'Inch Plant',
    fileName: 'Inch plant.jpg',
    alternateNames: ['Silver Inch Plant', 'Wandering Zebrina', 'Spiderwort'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Commelinales',
      family: 'Commelinaceae',
      genus: 'Tradescantia',
      species: 'T. zebrina',
      scientificName: 'Tradescantia zebrina',
      authority: 'Bosse',
    },
    characteristics: 'Bold green and silvery-white striped leaves.',
    leafMorphologyDetails:
      'Alternate, simple, fleshy ovate-oblong blades (4–10 cm long) with parallel venation, metallic silver-white longitudinal bands, and purple undersides along trailing stems.',
    uses: ['Garden borders', 'Natural indoor air purifier'],
    usesSummary: 'Garden borders, natural indoor air purifier',
    useCategory: 'Air Purification',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '40b, Kushwaha Nagar, Bhagat Singh Nagar, Indore, Madhya Pradesh 452015, India',
      lat: 22.751253,
      lng: 75.849834,
      latDisplay: '22.751253°',
      lngDisplay: '75.849834°',
      timestamp: 'Sunday, 04/10/2026 05:03 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Southern Mexico & Central America',
      continent: 'North & Central America',
      lat: 19.43,
      lng: -96.92,
      rangeRadiusDeg: 14,
      climateZone: 'Humid Subtropical & Tropical Understory',
      biogeographySummary:
        'Native to shaded forest margins and rocky banks of southern Mexico, Guatemala, and Belize; widely naturalized across tropical Asia including central India.',
    },
    defaultImageUrl: imgTradescantia,
    accentColor: '#2E6F40',
  },
  {
    id: 'hadjod',
    entryNumber: '02',
    commonName: 'Hadjod',
    fileName: 'Hadjod.jpg',
    alternateNames: ['Veldt Grape', "Devil's Backbone", 'Asthisamharaka'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Vitales',
      family: 'Vitaceae',
      genus: 'Cissus',
      species: 'C. quadrangularis',
      scientificName: 'Cissus quadrangularis L.',
      authority: 'L.',
    },
    characteristics: 'Fleshy, four-angled square stems.',
    leafMorphologyDetails:
      'Simple or shallowly 3-lobed, broadly ovate to reniform blades (2.5–5 cm) with toothed margins, borne at nodes opposite unbranched coiling tendrils along winged four-angled stems.',
    uses: ['Medicinal (bone setter)', 'Fracture recovery & joint therapy'],
    usesSummary: 'Medicinal (bone setter)',
    useCategory: 'Medicinal',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '89, Indore, Madhya Pradesh 452015, India',
      lat: 22.750944,
      lng: 75.849609,
      latDisplay: '22.750944°',
      lngDisplay: '75.849609°',
      timestamp: 'Sunday, 04/10/2026 04:54 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Indian Subcontinent & Tropical East Africa',
      continent: 'Asia & Africa',
      lat: 20.59,
      lng: 78.96,
      rangeRadiusDeg: 18,
      climateZone: 'Semi-Arid & Dry Tropical Scrub',
      biogeographySummary:
        'Indigenous to the Indian subcontinent, Sri Lanka, and dry tropical regions of East Africa and Arabia, thriving in warm, rocky habitats.',
    },
    defaultImageUrl: imgCissus,
    accentColor: '#4E7D34',
  },
  {
    id: 'indian-almond',
    entryNumber: '03',
    commonName: 'Indian Almond',
    fileName: 'Indian almond.jpg',
    alternateNames: ['Tropical Almond', 'Sea Almond', 'Desi Badam'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Myrtales',
      family: 'Combretaceae',
      genus: 'Terminalia',
      species: 'Terminalia catappa',
      scientificName: 'Terminalia catappa',
      authority: 'L.',
    },
    characteristics: 'Glossy, leathery, tropical leaves.',
    leafMorphologyDetails:
      'Spirally clustered large obovate blades (15–30 cm long, 10–18 cm broad) with a rounded apex, narrow subcordate base, prominent yellow-green midrib, and rich tannin content.',
    uses: ['Aquariums', 'Edible', 'Timber'],
    usesSummary: 'Aquariums, Edible, Timber',
    useCategory: 'Ecological & Timber',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '43, Sh 27, Kushwaha Nagar, Bhagat Singh Nagar, Indore, Madhya Pradesh 452015, India',
      lat: 22.750955,
      lng: 75.849528,
      latDisplay: '22.750955°',
      lngDisplay: '75.849528°',
      timestamp: 'Sunday, 04/10/2026 05:07 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Tropical Asia, Indo-Malaya & Northern Australia',
      continent: 'South & Southeast Asia',
      lat: 11.55,
      lng: 92.72,
      rangeRadiusDeg: 20,
      climateZone: 'Humid Tropical & Coastal Belt',
      biogeographySummary:
        'Native across the Indo-Malayan region, Indian coastal plains, Andaman Islands, and northern Australia; widely planted as a shade tree across central India.',
    },
    defaultImageUrl: imgIndianAlmond,
    accentColor: '#3B7A2A',
  },
  {
    id: 'bridal-bouquet',
    entryNumber: '04',
    commonName: 'Bridal Bouquet',
    fileName: 'Bridal Bouquet.jpg',
    alternateNames: ['Fiddle-Leaf Plumeria', 'White Frangipani', 'Wild Plumeria'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Gentianales',
      family: 'Apocynaceae',
      genus: 'Plumeria',
      species: 'Plumeria pudica',
      scientificName: 'Plumeria pudica Jacq.',
      authority: 'Jacq.',
    },
    characteristics: 'Dense spoon-shaped foliage, growth 10–15 feet tall.',
    leafMorphologyDetails:
      'Elongated spatulate to panduriform (fiddle- or spoon-shaped) dark-green glossy blades (15–25 cm long) with widened apical lobes and pale central midribs.',
    uses: ['Hedges and screening', 'Ornamental landscaping'],
    usesSummary: 'Hedges and Screening',
    useCategory: 'Ornamental & Hedges',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '40a, Kushwaha Nagar, Bhagat Singh Nagar, Indore, Madhya Pradesh 452015, India',
      lat: 22.751147,
      lng: 75.849722,
      latDisplay: '22.751147°',
      lngDisplay: '75.849722°',
      timestamp: 'Sunday, 04/10/2026 05:00 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Panama, Colombia & Venezuela',
      continent: 'South & Central America',
      lat: 8.98,
      lng: -73.25,
      rangeRadiusDeg: 13,
      climateZone: 'Neotropical Dry & Warm Lowlands',
      biogeographySummary:
        'Indigenous to northern South America (Colombia and Venezuela) and Panama; prized across Indian gardens for its profuse white blooms and unique spoon-shaped foliage.',
    },
    defaultImageUrl: imgBridalBouquet,
    accentColor: '#255238',
  },
  {
    id: 'thuja',
    entryNumber: '05',
    commonName: 'Thuja',
    fileName: 'Thuja.jpg',
    alternateNames: ['Oriental Arborvitae', 'Morpankhi', 'Chinese Thuja'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Pinales',
      family: 'Cupressaceae (Cypress)',
      genus: 'Platycladus',
      species: 'Thuja orientalis',
      scientificName: 'Platycladus orientalis',
      authority: '(L.) Franco',
    },
    characteristics: 'Evergreen foliage, cone-shaped growth habit, pleasant resinous fragrance.',
    leafMorphologyDetails:
      'Persistent, opposite, decussate scale-like leaves (1–3 mm) tightly appressed in flat vertical fan-like branchlet sprays along reddish-brown woody twigs.',
    uses: ['Traditional medicine', 'Essential oils'],
    usesSummary: 'Traditional medicine, Essential oils',
    useCategory: 'Medicinal',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '40-b, Banganga, Indore, Madhya Pradesh 452015, India',
      lat: 22.751173,
      lng: 75.849901,
      latDisplay: '22.751173°',
      lngDisplay: '75.849901°',
      timestamp: 'Sunday, 04/10/2026 05:01 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Northern China, Korea & Russian Far East',
      continent: 'East Asia',
      lat: 37.56,
      lng: 114.25,
      rangeRadiusDeg: 15,
      climateZone: 'Temperate to Subtropical Montane',
      biogeographySummary:
        'Native to northwestern and northern China, Korea, and the Russian Far East; widely cultivated across India as Morpankhi.',
    },
    defaultImageUrl: imgThuja,
    accentColor: '#2D5F4C',
  },
  {
    id: 'buddhist-pine',
    entryNumber: '06',
    commonName: 'Buddhist Pine',
    fileName: 'Buddhist Pine.jpg',
    alternateNames: ['Yew Plum Pine', 'Kusamaki', 'Southern Yew'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Pinales',
      family: 'Podocarpaceae',
      genus: 'Podocarpus',
      species: 'P. macrophyllus',
      scientificName: 'Podocarpus macrophyllus',
      authority: '(Thunb.) Sweet',
    },
    characteristics: 'Slow-growing coniferous evergreen shrub.',
    leafMorphologyDetails:
      'Linear-lanceolate, leathery strap-shaped leaves (5–10 cm long) arranged spirally around the stem with a raised midrib on both surfaces.',
    uses: ['Privacy hedges', 'Classical bonsai training'],
    usesSummary: 'Privacy hedges, classical bonsai training',
    useCategory: 'Ornamental & Hedges',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '43, Sh 27, Kushwaha Nagar, Bhagat Singh Nagar, Indore, Madhya Pradesh 452015, India',
      lat: 22.750934,
      lng: 75.849468,
      latDisplay: '22.750934°',
      lngDisplay: '75.849468°',
      timestamp: 'Sunday, 04/10/2026 04:55 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Southern Japan & Southern/Eastern China',
      continent: 'East Asia',
      lat: 31.82,
      lng: 130.55,
      rangeRadiusDeg: 14,
      climateZone: 'Warm Temperate & Subtropical Evergreen Forest',
      biogeographySummary:
        'Native to southern Japan (Kyushu, Shikoku, southern Honshu) and southern China; revered in temple courtyards and classical bonsai cultivation.',
    },
    defaultImageUrl: imgBuddhistPine,
    accentColor: '#568228',
  },
  {
    id: 'silver-wattle',
    entryNumber: '07',
    commonName: 'Silver Wattle',
    fileName: 'Silver wattle.jpg',
    alternateNames: ['Blue Wattle', 'Mimosa', 'Australian Wattle'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Fabales',
      family: 'Fabaceae',
      genus: 'Acacia',
      species: 'A. dealbata',
      scientificName: 'Acacia dealbata Link',
      authority: 'Link',
    },
    characteristics: 'Delicate, fern-like bipinnate leaves.',
    leafMorphologyDetails:
      'Paripinnately bipinnate compound leaves (8–14 cm long) comprising 10–26 pairs of pinnae, each bearing 20–50 pairs of minute linear silvery-green leaflets.',
    uses: ['Afforestation', 'Soil stabilization'],
    usesSummary: 'Afforestation',
    useCategory: 'Ecological & Timber',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '1, Banganga, Indore, Madhya Pradesh 452015, India',
      lat: 22.750904,
      lng: 75.849613,
      latDisplay: '22.750904°',
      lngDisplay: '75.849613°',
      timestamp: 'Sunday, 04/10/2026 04:53 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Southeastern Australia & Tasmania',
      continent: 'Australia / Oceania',
      lat: -36.85,
      lng: 147.24,
      rangeRadiusDeg: 13,
      climateZone: 'Temperate Eucalypt Forest & Highland Valleys',
      biogeographySummary:
        'Native to southeastern Australia (New South Wales, Victoria, Tasmania); introduced to India for highland afforestation and soil enrichment.',
    },
    defaultImageUrl: imgSilverWattle,
    accentColor: '#487559',
  },
  {
    id: 'half-flower',
    entryNumber: '08',
    commonName: 'Half Flower',
    fileName: 'Half flower.png',
    alternateNames: ['Beach Cabbage', 'Beach Naupaka', 'Safed Modak'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Asterales',
      family: 'Goodeniaceae',
      genus: 'Scaevola',
      species: 'S. taccada',
      scientificName: 'Scaevola taccada',
      authority: '(Gaertn.) Roxb.',
    },
    characteristics: 'Evergreen, glossy leaves.',
    leafMorphologyDetails:
      'Succulent, obovate-spatulate glossy blades (10–22 cm long) with rounded apex, smooth waxy cuticle, and fan-shaped five-lobed pale pink-white blossoms.',
    uses: ['Eye care', 'Windbreaks'],
    usesSummary: 'Eye care, windbreaks',
    useCategory: 'Medicinal',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '40a, Kushwaha Nagar, Bhagat Singh Nagar, Indore, Madhya Pradesh 452015, India',
      lat: 22.751147,
      lng: 75.849722,
      latDisplay: '22.751147°',
      lngDisplay: '75.849722°',
      timestamp: 'Sunday, 04/10/2026 05:00 PM GMT +05:30',
      overlayPosition: 'top',
    },
    nativeOrigin: {
      regionName: 'Indo-Pacific & Indian Ocean Littoral Belt',
      continent: 'Asia-Pacific & Indian Ocean',
      lat: 8.24,
      lng: 77.52,
      rangeRadiusDeg: 22,
      climateZone: 'Tropical Coastal & Monsoon Zone',
      biogeographySummary:
        'Native to tropical coastlines of the Indian and Pacific Oceans (including peninsular India, Sri Lanka, and Southeast Asia); grown inland as a hardy evergreen shrub.',
    },
    defaultImageUrl: imgHalfFlower,
    accentColor: '#376B45',
  },
  {
    id: 'rose-of-sharon',
    entryNumber: '09',
    commonName: 'Rose of Sharon',
    fileName: 'Rose of sharon.png',
    alternateNames: ['Shrub Althea', 'Korean Rose', 'Syrian Ketmia'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Malvales',
      family: 'Malvaceae',
      genus: 'Hibiscus',
      species: 'H. syriacus',
      scientificName: 'Hibiscus syriacus',
      authority: 'L.',
    },
    characteristics: 'Deciduous shrubs with three-lobed coarsely toothed leaves.',
    leafMorphologyDetails:
      'Alternate, simple, rhombic-ovate to palmately three-lobed blades (4–10 cm long) with cuneate bases, irregular marginal teeth, and three palmate main veins.',
    uses: ['Ornamental', 'Flowering garden borders'],
    usesSummary: 'Ornamental',
    useCategory: 'Ornamental & Hedges',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '40a, Kushwaha Nagar, Bhagat Singh Nagar, Indore, Madhya Pradesh 452015, India',
      lat: 22.751147,
      lng: 75.849722,
      latDisplay: '22.751147°',
      lngDisplay: '75.849722°',
      timestamp: 'Sunday, 04/10/2026 05:00 PM GMT +05:30',
      overlayPosition: 'top',
    },
    nativeOrigin: {
      regionName: 'South-Central China & Korean Peninsula',
      continent: 'East Asia',
      lat: 35.91,
      lng: 127.77,
      rangeRadiusDeg: 14,
      climateZone: 'Humid Continental to Subtropical',
      biogeographySummary:
        'Native to south-central and southeastern China and celebrated across East Asia; widely grown across India as an ornamental flowering shrub.',
    },
    defaultImageUrl: imgRoseOfSharon,
    accentColor: '#2F643B',
  },
  {
    id: 'spider-plant',
    entryNumber: '10',
    commonName: 'Spider Plant',
    fileName: 'Spider plant.png',
    alternateNames: ['Ribbon Plant', 'Airplane Plant', 'Spider Ivy'],
    taxonomy: {
      kingdom: 'Plantae',
      order: 'Asparagales',
      family: 'Asparagaceae',
      genus: 'Chlorophytum',
      species: 'C. comosum',
      scientificName: 'Chlorophytum comosum',
      authority: '(Thunb.) Jacques',
    },
    characteristics: 'Grows in dense basal rosettes.',
    leafMorphologyDetails:
      'Linear, channeled, arching leaves (20–45 cm long, 1–2.5 cm wide) with creamy-yellow central stripes, rich green margins, parallel venation, and smooth entire edges.',
    uses: ['Air purification', 'Indoor and outdoor foliage borders'],
    usesSummary: 'Air Purification',
    useCategory: 'Air Purification',
    geotag: {
      locationTitle: 'Indore, Madhya Pradesh, India',
      address: '43, Sh 27, Kushwaha Nagar, Bhagat Singh Nagar, Indore, Madhya Pradesh 452015, India',
      lat: 22.750934,
      lng: 75.849468,
      latDisplay: '22.750934°',
      lngDisplay: '75.849468°',
      timestamp: 'Sunday, 04/10/2026 04:55 PM GMT +05:30',
      overlayPosition: 'bottom',
    },
    nativeOrigin: {
      regionName: 'Southern & Tropical Africa (Cape to East Africa)',
      continent: 'Africa',
      lat: -29.85,
      lng: 31.02,
      rangeRadiusDeg: 18,
      climateZone: 'Subtropical Forest Floor & Riverine Valleys',
      biogeographySummary:
        'Native to tropical and southern Africa; widely cultivated globally for its arching variegated rosettes and air-purifying properties.',
    },
    defaultImageUrl: imgSpiderPlant,
    accentColor: '#5B8C2A',
  },
];
