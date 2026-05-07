import type { LocalizedText } from './types'

export type PhotographyItem = {
  id: string
  images: string[]
  name: LocalizedText
  datetime: string
  coordinates: {
    lat: number
    lng: number
  }
  location: LocalizedText
  thought: LocalizedText
}

export const photographyItems: PhotographyItem[] = [
  {
    id: 'sunset-through-buildings',
    images: [ 'fxn 2026-03-18 175048280436F8A06D.JPG'],
    name: { zh: '建築間的夕陽', en: 'Sunset Through Buildings' },
    datetime: '2026-03-18, 5:50 PM',
    coordinates: { lat: 24.18045637527883, lng: 120.64659913566447 },
    location: { zh: '逢甲大學育樂館', en: 'Feng Chia University Recreation Building' },
    thought: {
      zh: '複雜的建築群間，留給夕陽穿越而過的空隙和底氣，就像微光照進黑暗，讓深淵的人有了往上爬的勇氣。',
      en: 'The sun beam pass through the buildings, like a ray of hope in the darkness, a courage to come back.',
    }
  },
  {
    id: 'tasik-cermin-2',
    images: [ 'fxn 2026-01-17 110145.149.JPG'],
    name: { zh: 'Tasik Cermin 2', en: 'Tasik Cermin 2' },
    datetime: '2026-01-17, 11:01 AM',
    coordinates: { lat: 4.558453640178404, lng: 101.11811649686366 },
    location: { zh: 'Tasik Cermin 2', en: 'Tasik Cermin 2' },
    thought: {
      zh: '置身於鏡湖，倒影的世界，靜謐而美。',
      en: 'The beautiful mirror lake, a world of reflections, serene and captivating.',
    }
  },
  {
    id: 'yuguang-island',
    images: [
      'DSC_0998_E.jpg',
      'DSC_1007_E.jpg',
      'DSC_1015_E.jpg'
    ],
    name: { zh: '漁光島', en: 'Yuguang Island' },
    datetime: '2026-01-08, 3:57 PM',
    coordinates: { lat: 22.98112796514981, lng: 120.15588378370154 },
    location: { zh: '漁光島', en: 'Yuguang Island' },
    thought: {
      zh: '和愛人牽著手，沿著海岸線漫步，感受台南的海風和夕陽，依然很愛台南。',
      en: 'Walking hand in hand along the coast, feeling the sea breeze and sunset of Tainan.',
    },
  },
  {
    id: 'yuguang-forest',
    images: [
      'DSC_0991_E.jpg',
    ],
    name: { zh: '漁光森林-光影', en: 'Yuguang Forest' },
    datetime: '2026-01-08, 3:43 PM',
    coordinates: { lat: 22.981393972936754, lng: 120.15543272712122 },
    location: { zh: '漁光森林', en: 'Yuguang Forest' },
    thought: {
      zh: '光影間的安平，總是讓人想留下。',
      en: 'Shade of the trees, Anping.',
    },
  },
  {
    id: 'fusion-space-1962',
    images: [
      'fxn 2025-10-11 151445.222.JPG',
    ],
    name: { zh: '光影間', en: 'Light and Shadow' },
    datetime: '2025-10-11, 3:14 PM',
    coordinates: { lat: 24.135195541826317, lng: 120.68376990552466 },
    location: { zh: '富興工廠1962文創聚落', en: 'Fusion Space 1962' },
    thought: {
      zh: '意外發現的文創聚落，有書店，和藏在光影間的故事。',
      en: 'Books, stories, the spirit of creativity.',
    },
  },
  {
    id: 'tamsui-golden-hour',
    images: ['IMG_2996.JPEG', 'tamsui-1.JPG', 'tamsui-2.JPG'],
    name: { zh: '淡水', en: 'Tamsui' },
    datetime: '2025-08-26, 6:20 PM',
    coordinates: { lat: 25.18228319361199, lng: 121.41067804743852 },
    location: { zh: '淡水', en: 'Tamsui' },
    thought: {
      zh: '去了心心念念的淡水，有喜歡的夕陽，和愛的人。',
      en: 'Finally made it to Tamsui, with a sunset I liked and the person I love.',
    },
  },
  {
    id: 'taipei-101',
    images: [
      'IMG_2880.jpg',
    ],
    name: { zh: '台北101', en: 'Taipei 101' },
    datetime: '2025-08-25, 6:31 PM',
    coordinates: { lat: 25.033368375989784, lng: 121.56495144207291 },
    location: { zh: '台北101', en: 'Taipei 101' },
    thought: {
      zh: '從機場去政大的路上，進入隧道前把它拍下，意外偶爾也有驚喜。',
      en: 'Sometimes surprises come from the unexpected.',
    },
  },
  {
    id: 'minyak-beku',
    images: [
      'fxn 2025-08-15 191250.536.JPG',
    ],
    name: { zh: 'Minyak Beku', en: 'Minyak Beku' },
    datetime: '2025-08-15, 7:12 PM',
    coordinates: { lat: 1.7956217077637162, lng: 102.88893535739265 },
    location: { zh: 'Minyak Beku', en: 'Minyak Beku' },
    thought: {
      zh: '家鄉的海，總是帶有鄉愁。每次離家前都會回來，看看這片陪我走過很多故事的海。',
      en: 'The sea of hometown always carries nostalgia. Like old friend, means a lot to me.',
    },
  },
  {
    id: 'singapore-street',
    images: [
      'D72_2766.JPG',
      'D72_2767.JPG',
    ],
    name: { zh: '新加坡街道', en: 'Singapore Street' },
    datetime: '2024-09-14, 6:46 PM',
    coordinates: { lat: 1.2896139981180326, lng: 103.86120625642481 },
    location: { zh: '新加坡街道', en: 'Singapore Street' },
    thought: {
      zh: '第一次去到新加坡，參加完婚禮，傍晚去坐摩天輪，有夕陽，有愛的人，一切都剛剛好。',
      en: 'First time in Singapore, after the wedding, evening at the Ferris wheel, sunset and the person I love.',
    },
  },
  {
    id: 'gaomei-wetlands',
    images: ['IMG_6224.jpg'],
    name: { zh: '高美濕地', en: 'Gaomei Wetlands' },
    datetime: '2024-01-10, 5:29 PM',
    coordinates: { lat: 24.314805655393954, lng: 120.54725151642408 },
    location: { zh: '高美濕地', en: 'Gaomei Wetlands' },
    thought: {
      zh: '在台灣的第一個冬天、第一個寒假，依然懷念。',
      en: 'Still miss the first winter and first cold season I spent in Taiwan.',
    },
  },
  {
    id: 'taiwan-national-day-fireworks',
    images: ['DSC_9769.jpg'],
    name: { zh: '台灣國慶煙火', en: 'Taiwan National Day Fireworks' },
    datetime: '2023-10-10, 8:14 PM',
    coordinates: { lat: 24.180397959679794, lng: 120.64846115873343 },
    location: { zh: '逢甲大學操場', en: 'Feng Chia University Sports Field' },
    thought: {
      zh: '第一次參與台灣國慶，願你順遂，台灣。',
      en: 'First time participating in Taiwan National Day. In love, in hope, in solidarity.',
    },
  },
  {
    id: 'malacca-locksmith',
    images: ['DSC_9500.jpg'],
    name: { zh: '馬六甲鎖匠', en: 'Malacca Locksmith' },
    datetime: '2023-01-31, 11:09 AM',
    coordinates: { lat: 2.1946147779244596, lng: 102.24853938360984 },
    location: { zh: '馬六甲老街', en: 'Malacca Old Street' },
    thought: {
      zh: '致敬匠人精神，頸項駝了，精神還在。',
      en: 'Honoring the craftsmanship, the neck may be bent, the spirit remains strong.',
    },
  },
  {
    id: 'kuala-sangga-sunset',
    images: ['DSC_1706.JPG'],
    name: { zh: '太平十八丁日落', en: 'Kuala Sangga Sunset' },
    datetime: '2019-11-21, 6:40 PM',
    coordinates: { lat: 4.842604329613293, lng: 100.58787739444134},
    location: { zh: '太平十八丁', en: 'Kuala Sangga' },
    thought: {
      zh: '一轉眼就七年了，還記得那天的行程是餵老鷹、去老港和看螢火蟲。',
      en: 'It\'s been 7 years, still remember the trip that day.',
    },
  },
  {
    id: 'penang-hill-sunrise',
    images: ['DSC_1234.JPG'],
    name: { zh: '升旗山日出', en: 'Sunrise at Penang Hill' },
    datetime: '2019-11-20, 7:15 AM',
    coordinates: { lat: 5.4238313378104905, lng: 100.27001924705533 },
    location: { zh: '升旗山', en: 'Penang Hill, Penang' },
    thought: {
      zh: '那一天，升旗山的日出很耀眼，底下望過去是檳城大橋，一點點的雲海，還有一群很棒的人。',
      en: 'The dazzling sunrise, and the people with kind heart.',
    },
  },
]

export function getPhotographyImageSrc(image: string): string {
  if (/^https?:\/\//i.test(image)) {
    return image
  }

  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`

  return `${base}photography/${image.replace(/^\/+/, '')}`
}

export function getGoogleMapsEmbedUrl(item: PhotographyItem): string {
  const query = encodeURIComponent(`${item.coordinates.lat},${item.coordinates.lng}`)
  return `https://www.google.com/maps?q=${query}&z=13&output=embed`
}

export function formatCoordinates(item: PhotographyItem): string {
  return `${item.coordinates.lat.toFixed(6)}, ${item.coordinates.lng.toFixed(6)}`
}
