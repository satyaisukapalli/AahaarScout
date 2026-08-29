import { Restaurant } from '../types';
import logoImg from '../assets/images/aahaarscout_logo_1788014860991.jpg';

export const LOGO_URL = logoImg;

export const HYDERABAD_MAP_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNZgBEElYYMs2Sruc6Kl6MEUZJIogbcIQAGsdKLB3zRBQiSo3SuiHra9eVmfnEypEtkeSBuiuJUaxysEHrGO-xmByplfsjAE7ON1dDVTOirCS0nYSiWc5WOVpwTky1WGWxspsoz-4ngS38zabpSO5i-Q7fV6AcBJPLv92XlfC5651-oL6FQPjp1WUWDqFQplNk6k8V5-RW7BB8SY9E6DI55CoajA7XaKyWjrgoyBQ9U5FtfjPr3WHqQQ';

export const ROME_MAP_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI3itn-dIGtjt5YwyjNCWgFZBhPUJWM-6ZGaVOmOnoRv06F0C4Nnms88W6x5Kys1hRD5lgWHFHU_DHbm2UBYPsO2DSCdJjKeyISMD6tLxLKi8MqYhGG8ZwBK_puDjObfOgqegWjj6fkNAz71Aw6Lj67kKzskm1Vwv2h_BaL9qbA5GpOAi9YzZGf_0kl15XIka_k1fePSFbD7ZFKphKp6izM1uWfSuc9oivWxf7eOd4wPXTc9S93GoRYw';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'paradise-biryani',
    name: 'Paradise Biryani',
    cuisine: 'North Indian • Biryani',
    neighborhood: 'Secunderabad',
    city: 'Hyderabad',
    rating: 4.8,
    reviewsCount: 18420,
    priceRange: '$$',
    priceForTwo: '₹600 for two',
    distance: '3.1 km',
    matchScore: 98,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf6EsMkuk84g_5EPYKRo6ZG-sz_lvsN4pzNG9RRC3s11lJA2pSJ6jSf6_fnB8JMpGACPifHHoa4dVuo90RUewAehsl0LUCOFLt-YS4V3EMAPcPfZ7_pfwRs2GRBH6r65LAeobsQrOanTvmEJBk6Iyd0Xr_CnK7TcP1H9v_2ovvQH11sFktxuTnbpHu4UC7CqSWi7Yr9e3hYSNo9FbLTkp0k3PXjXQZtzY4ozIIIh0TZe_P8qCTAXeTAQ',
    tags: ['Biryani', 'Kebabs', 'Legendary', 'Family'],
    vibe: 'Lively',
    vibes: ['Lively', 'Casual'],
    mustTry: 'Special Royal Chicken Dum Biryani, Mutton Seekh Kebab',
    aiReasoning: 'A legendary culinary landmark since 1953. Consistently lauded for authentic saffron fragrance, slow-cooked tender meat, and flavorful mirchi ka salan.',
    aiInsight: 'The gold standard for Hyderabadi dum biryani with over seven decades of mastered dum cooking technique.',
    signatureDishes: [
      {
        id: 'p-1',
        name: 'Royal Chicken Dum Biryani',
        description: 'Long grain basmati layered with succulent marinated chicken, fried onions, saffron & whole spices.',
        price: '₹340',
        matchScore: 98,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf6EsMkuk84g_5EPYKRo6ZG-sz_lvsN4pzNG9RRC3s11lJA2pSJ6jSf6_fnB8JMpGACPifHHoa4dVuo90RUewAehsl0LUCOFLt-YS4V3EMAPcPfZ7_pfwRs2GRBH6r65LAeobsQrOanTvmEJBk6Iyd0Xr_CnK7TcP1H9v_2ovvQH11sFktxuTnbpHu4UC7CqSWi7Yr9e3hYSNo9FbLTkp0k3PXjXQZtzY4ozIIIh0TZe_P8qCTAXeTAQ'
      }
    ],
    phone: '(040) 6666-5588',
    website: 'paradisefoodcourt.in',
    hours: '11:00 AM - 11:30 PM',
    address: 'SD Road, Secunderabad, Hyderabad'
  },
  {
    id: 'chutneys',
    name: 'Chutneys',
    cuisine: 'South Indian • Breakfast',
    neighborhood: 'Banjara Hills',
    city: 'Hyderabad',
    rating: 4.7,
    reviewsCount: 9240,
    priceRange: '$$',
    priceForTwo: '₹500 for two',
    distance: '1.8 km',
    matchScore: 95,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwui69H2nqjfTLgjmnr4hgF3_fd2owLCO6kipXwZIXuD1IvjXPmQQCVCQOQmNgZ8dBioAq_TmZq6jSWUc3pA3hAWpmqPfAbyNDzpLNed2H_Migk6IuTn0LY_y7x4nO0uXLFFR8uH9Kpj64sT1i3yt6Vrlwv8QKsyeQ0XDxX859Iv34ai-zi7rs-qp6uviHFDE4Dxj_djw-fA04RKrm8bzFtzNGK3cCiPF00WwYc_U_ps-DlDDx2KWkFQ',
    tags: ['Dosa', 'Vegetarian', 'Breakfast', 'Iconic'],
    vibe: 'Casual',
    vibes: ['Casual', 'Family'],
    mustTry: 'Guntur Idli, 7-Chutney Babai Dosa, Filter Coffee',
    aiReasoning: 'Renowned for its crisp ghee-roasted dosas served alongside an iconic spread of 6 freshly churned artisanal chutneys.',
    aiInsight: 'A beloved Hyderabad breakfast staple, unmatched for authentic South Indian comfort and hygienic morning dining.',
    signatureDishes: [
      {
        id: 'c-1',
        name: 'Babai Butter Ghee Dosa',
        description: 'Golden, crispy hand-stretched dosa topped with dollops of white butter, accompanied by 6 house chutneys.',
        price: '₹195',
        matchScore: 97,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwui69H2nqjfTLgjmnr4hgF3_fd2owLCO6kipXwZIXuD1IvjXPmQQCVCQOQmNgZ8dBioAq_TmZq6jSWUc3pA3hAWpmqPfAbyNDzpLNed2H_Migk6IuTn0LY_y7x4nO0uXLFFR8uH9Kpj64sT1i3yt6Vrlwv8QKsyeQ0XDxX859Iv34ai-zi7rs-qp6uviHFDE4Dxj_djw-fA04RKrm8bzFtzNGK3cCiPF00WwYc_U_ps-DlDDx2KWkFQ'
      }
    ],
    phone: '(040) 2335-5841',
    website: 'chutneysrestaurants.com',
    hours: '7:00 AM - 10:30 PM',
    address: 'Road No. 3, Banjara Hills, Hyderabad'
  },
  {
    id: 'roastery-coffee-house',
    name: 'Roastery Coffee House',
    cuisine: 'Continental • Cafe',
    neighborhood: 'Jubilee Hills',
    city: 'Hyderabad',
    rating: 4.8,
    reviewsCount: 8120,
    priceRange: '$$$',
    priceForTwo: '₹800 for two',
    distance: '2.5 km',
    matchScore: 92,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVHn1TGgGljO04j80zHlxXzQGovlQmuDJ3f_97ELJzQJQ2BoRg1b1Wh-BiMEEJW-9FDBE9Z1WxiXLrQ4Cwp1KJCZwNXoLW1KQvAIOp_MFfY9_aclGZXlklsGVKOGw8pvQJGLlVG6pjEkIbK8XKoEtZ11IlyFSFyjCpJXupH2g2u4VpJZkeHXvKA2UW4MdfNmLmRFriHv8m3_VM90aByqn63iNaofQLEX8n6l1iNpRQ_RAzOfpGvln0AA',
    tags: ['Coffee', 'Continental', 'Artisanal', 'Cozy Courtyard'],
    vibe: 'Casual',
    vibes: ['Casual', 'Romantic', 'Business'],
    mustTry: 'Monsooned Malabar Pour Over, Gourmet Beef Burger, Almond Croissant',
    aiReasoning: 'Housed in a tranquil bungalow courtyard with India’s finest single-origin specialty coffees roasted in-house.',
    aiInsight: 'Voted Hyderabad’s top third-wave coffee sanctuary for quiet work afternoons and artisanal European brunch.',
    signatureDishes: [
      {
        id: 'r-1',
        name: 'Artisan Brioche Burger',
        description: 'Juicy double patty, melted mature cheddar, caramelized onions on freshly baked brioche bun.',
        price: '₹380',
        matchScore: 93,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVHn1TGgGljO04j80zHlxXzQGovlQmuDJ3f_97ELJzQJQ2BoRg1b1Wh-BiMEEJW-9FDBE9Z1WxiXLrQ4Cwp1KJCZwNXoLW1KQvAIOp_MFfY9_aclGZXlklsGVKOGw8pvQJGLlVG6pjEkIbK8XKoEtZ11IlyFSFyjCpJXupH2g2u4VpJZkeHXvKA2UW4MdfNmLmRFriHv8m3_VM90aByqn63iNaofQLEX8n6l1iNpRQ_RAzOfpGvln0AA'
      }
    ],
    phone: '(040) 2355-6677',
    website: 'roasterycoffee.co.in',
    hours: '8:00 AM - 11:00 PM',
    address: 'Road No. 45, Jubilee Hills, Hyderabad'
  },
  {
    id: 'concu',
    name: 'Conçu',
    cuisine: 'Desserts • Bakery',
    neighborhood: 'Jubilee Hills',
    city: 'Hyderabad',
    rating: 4.9,
    reviewsCount: 6540,
    priceRange: '$$$',
    priceForTwo: '₹900 for two',
    distance: '2.9 km',
    matchScore: 90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_tMNke_20iyzpQ3PaLGJDdf3whV_ifW8H3mqwUgeb1xtNan5iEV-rO9kIVorRgI9-quF9ti_gPNY1lbkch7x1jbs8J9yW-usIewNEbXHa2VnI0T1HVZy4LU5X4-nb9lPVx7FI0SMyA8OujN7itgGnNbv6LGN8DQpHYm0geVXWDbB0qLPRQhACkT9gUorn0sslPLeNKWMmiQFfwpkcuPSMIw9RSuPPqPkm2hYCFIiZ-RQymlOM551t9Q',
    tags: ['Desserts', 'Bakery', 'French Pastry', 'Aesthetic'],
    vibe: 'Romantic',
    vibes: ['Romantic', 'Casual'],
    mustTry: 'Valrhona Chocolate Molten Lava Cake, Pistachio Raspberry Choux',
    aiReasoning: 'Exquisite French pâtisserie and viennoiserie crafted with imported ingredients and Michelin-inspired aesthetic precision.',
    aiInsight: 'The definitive destination for high-end dessert lovers seeking refined European elegance.',
    signatureDishes: [
      {
        id: 'cn-1',
        name: 'Molten Dark Chocolate Fondant',
        description: 'Warm flowing Valrhona 70% dark chocolate core with Madagascar vanilla bean gelato & fresh berries.',
        price: '₹340',
        matchScore: 92,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_tMNke_20iyzpQ3PaLGJDdf3whV_ifW8H3mqwUgeb1xtNan5iEV-rO9kIVorRgI9-quF9ti_gPNY1lbkch7x1jbs8J9yW-usIewNEbXHa2VnI0T1HVZy4LU5X4-nb9lPVx7FI0SMyA8OujN7itgGnNbv6LGN8DQpHYm0geVXWDbB0qLPRQhACkT9gUorn0sslPLeNKWMmiQFfwpkcuPSMIw9RSuPPqPkm2hYCFIiZ-RQymlOM551t9Q'
      }
    ],
    phone: '(040) 2360-1234',
    website: 'concu.in',
    hours: '11:00 AM - 11:30 PM',
    address: 'Road No. 37, Jubilee Hills, Hyderabad'
  },
  {
    id: 'pista-house',
    name: 'Pista House',
    cuisine: 'Hyderabadi • Charminar',
    neighborhood: 'Charminar',
    city: 'Hyderabad',
    rating: 4.7,
    reviewsCount: 14200,
    priceRange: '$$',
    priceForTwo: '₹450 for two',
    distance: '4.5 km',
    matchScore: 96,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArQpg9yax59hLba1QiE_EeFcKFLE47AjN1ZfjOzXOS7OLz25_uITstl53CgPPYGU9jckl6zJeW1jWWLgJ9fNb3Pd1U5tF1rvsHIAPxaDdM0W72zjolkTpUIO6jx9PtOBLnJqm9CFgRPz5Nhy-KROjegNDgzC6pCFABehaT3yoX1GVzM_xe0UhTS_jSI2RDaSP5QW1u0ayorCm3nyDaVflcyxfPpHag1HVV8J2xdUE_gfDYL_PGe18T_A',
    tags: ['Haleem', 'Desserts', 'Zafrani Tea', 'Heritage'],
    vibe: 'Lively',
    vibes: ['Lively', 'Casual'],
    mustTry: 'GI-tagged Shahi Mutton Haleem, Kaddu ki Kheer',
    aiReasoning: 'Global ambassadors of authentic GI-certified Hyderabadi Haleem cooked overnight on wooden bhattis with pure desi ghee.',
    aiInsight: 'An unmissable heritage spot near Charminar for rich slow-cooked delights and traditional Nawabi sweets.',
    signatureDishes: [
      {
        id: 'ph-1',
        name: 'GI Special Shahi Mutton Haleem',
        description: 'Slow-pounded tender mutton, broken wheat, lentils and aromatic spices stewed for 12 hours.',
        price: '₹280',
        matchScore: 96,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArQpg9yax59hLba1QiE_EeFcKFLE47AjN1ZfjOzXOS7OLz25_uITstl53CgPPYGU9jckl6zJeW1jWWLgJ9fNb3Pd1U5tF1rvsHIAPxaDdM0W72zjolkTpUIO6jx9PtOBLnJqm9CFgRPz5Nhy-KROjegNDgzC6pCFABehaT3yoX1GVzM_xe0UhTS_jSI2RDaSP5QW1u0ayorCm3nyDaVflcyxfPpHag1HVV8J2xdUE_gfDYL_PGe18T_A'
      }
    ],
    phone: '(040) 2456-3322',
    website: 'pistahouse.in',
    hours: '11:00 AM - 12:00 AM',
    address: 'Near Charminar, Old City, Hyderabad'
  },
  {
    id: 'bawarchi-restaurant',
    name: 'Bawarchi Restaurant',
    cuisine: 'Mughlai, Hyderabadi • ₹400 for two',
    neighborhood: 'RTC X Roads',
    city: 'Hyderabad',
    rating: 4.8,
    reviewsCount: 22800,
    priceRange: '$$',
    priceForTwo: '₹400 for two',
    distance: '2.4 km',
    matchScore: 96,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwlAvJp7sw8u4dpcwahZayRcygGCqTRyyo4oWTayr8GjPcS8JcMPDJL5994oBB3Wxlm0T-itPoZm7YCVnTG1UPhhDTTIBSS42ogp9lVZcRwzqYALEdPMVGOzNqOr0RKe-q-y4-LSmEfpa1dJMfRLXZjkR7WhgD7vPK5_Rn12aqWbNgDqC9vQB1uA7FVQuELkHGvgOZN0j7ZdJetBuXp43Nytk2zBF19oyYesA_BuAlHPIl2zQ2lkNjvA',
    tags: ['Family', 'Dinner', 'Budget Friendly', 'Top Rated'],
    vibe: 'Lively',
    vibes: ['Lively', 'Casual'],
    mustTry: 'Chicken Dum Biryani, Family Pack, Boti Kebab',
    aiReasoning: 'Why we picked it: Exceptional family atmosphere with generous portions. Their Mutton Biryani is consistently rated top-tier by locals.',
    aiInsight: 'The legendary RTC X Roads hotspot celebrated for colossal flavor and unbeatable value under ₹500.',
    signatureDishes: [
      {
        id: 'bw-1',
        name: 'Signature Chicken Biryani Handi',
        description: 'Authentic spice blend with deeply flavorful chicken cooked dum-style with aromatic basmati rice.',
        price: '₹260',
        matchScore: 97,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwlAvJp7sw8u4dpcwahZayRcygGCqTRyyo4oWTayr8GjPcS8JcMPDJL5994oBB3Wxlm0T-itPoZm7YCVnTG1UPhhDTTIBSS42ogp9lVZcRwzqYALEdPMVGOzNqOr0RKe-q-y4-LSmEfpa1dJMfRLXZjkR7WhgD7vPK5_Rn12aqWbNgDqC9vQB1uA7FVQuELkHGvgOZN0j7ZdJetBuXp43Nytk2zBF19oyYesA_BuAlHPIl2zQ2lkNjvA'
      }
    ],
    phone: '(040) 2763-4490',
    website: 'bawarchihyderabad.com',
    hours: '11:30 AM - 11:30 PM',
    address: 'RTC X Roads, Musheerabad, Hyderabad'
  },
  {
    id: 'cafe-bahar',
    name: 'Cafe Bahar',
    cuisine: 'Hyderabadi, North Indian • ₹350 for two',
    neighborhood: 'Basheerbagh',
    city: 'Hyderabad',
    rating: 4.6,
    reviewsCount: 16900,
    priceRange: '$',
    priceForTwo: '₹350 for two',
    distance: '3.8 km',
    matchScore: 92,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-UikvsRYUxszVqiZDwMlRxZ021A1leETEkI4r7CM6Opztnx6jTaET3Bhdt119_Ozm_69Dm82i8AcjILw82nxpZtnaW7gVdnprqHJ1Djvuxse56uSqXc4NLRGlWrLgCu9_kVas-TsTTIvQsaTuzcuyIc9WabSmz8aPx5n0gJm88RwhoaHnSIKQbxPx4rZ25AY6PCMgi_ubwPZ8mEzNn_e6H4-LEYnz0rGS_mKL_06Dek6mbStSeMhkvg',
    tags: ['Groups', 'Casual', 'Late Night', 'Best Value'],
    vibe: 'Casual',
    vibes: ['Casual', 'Lively'],
    mustTry: 'Special Chicken Biryani, Mutton Curry, Irani Chai',
    aiReasoning: 'Why we picked it: Great value under ₹500 with a bustling vibe perfect for groups. The Special Chicken Biryani is a crowd-pleaser.',
    aiInsight: 'An institution for authentic Hyderabadi spicy biryani with strong aromatic masala and legendary Irani chai.',
    signatureDishes: [
      {
        id: 'cb-1',
        name: 'Special Bahar Dum Biryani',
        description: 'Hearty serving with extra ghee masala, golden fried onions and tender chicken pieces.',
        price: '₹220',
        matchScore: 94,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-UikvsRYUxszVqiZDwMlRxZ021A1leETEkI4r7CM6Opztnx6jTaET3Bhdt119_Ozm_69Dm82i8AcjILw82nxpZtnaW7gVdnprqHJ1Djvuxse56uSqXc4NLRGlWrLgCu9_kVas-TsTTIvQsaTuzcuyIc9WabSmz8aPx5n0gJm88RwhoaHnSIKQbxPx4rZ25AY6PCMgi_ubwPZ8mEzNn_e6H4-LEYnz0rGS_mKL_06Dek6mbStSeMhkvg'
      }
    ],
    phone: '(040) 2323-7605',
    website: 'cafebahar.in',
    hours: '11:00 AM - 11:45 PM',
    address: 'Hyderguda, Basheerbagh, Hyderabad'
  },
  {
    id: 'l-osteria-moderna',
    name: "L'Osteria Moderna",
    cuisine: 'Italian • Modern Fine Dining',
    neighborhood: 'West End, Downtown',
    city: 'Rome',
    rating: 4.9,
    reviewsCount: 428,
    priceRange: '$$$$',
    priceForTwo: '$120 for two',
    distance: '0.8 mi',
    matchScore: 98,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTv1rHWMYwPgMG8enpkdj9Fyo9eG21rzUU7n96phuorefXXtTVAqtr2AV5ATgBvR31n-oU-u__xSn5KuI8gBlnamNZH85sUMLeuWQX7BJqnS3m0dCSj-lOOgNDnRZuWIBfGDlAP89fb-7CehJECbS6JuVW-dmUgThej9uxrWB0BD8dRVbTZ8LZBDQjLF2PFC134ZBRQx0PZFOKwe17_KpU7J48ChnBn27ohrcGpghTv-zNg3xvjwtOpQ',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTv1rHWMYwPgMG8enpkdj9Fyo9eG21rzUU7n96phuorefXXtTVAqtr2AV5ATgBvR31n-oU-u__xSn5KuI8gBlnamNZH85sUMLeuWQX7BJqnS3m0dCSj-lOOgNDnRZuWIBfGDlAP89fb-7CehJECbS6JuVW-dmUgThej9uxrWB0BD8dRVbTZ8LZBDQjLF2PFC134ZBRQx0PZFOKwe17_KpU7J48ChnBn27ohrcGpghTv-zNg3xvjwtOpQ',
    tags: ['Italian', 'Pasta', 'Fine Dining', 'Romantic'],
    vibe: 'Romantic',
    vibes: ['Romantic', 'Business'],
    mustTry: 'Truffle Risotto, Seared Scallops, Modern Tiramisu',
    aiReasoning: 'A masterclass in modern Italian cuisine where traditional flavors meet contemporary technique. Consistently praised for its exceptional handmade pasta and an ambiance that balances sophisticated dining with organic warmth.',
    aiInsight: 'A masterclass in modern Italian cuisine where traditional flavors meet contemporary technique. Consistently praised for its exceptional handmade pasta and an ambiance that balances sophisticated dining with organic warmth.',
    signatureDishes: [
      {
        id: 'lom-1',
        name: 'Truffle Risotto',
        description: 'Acquerello rice, black truffle, 24-month parmigiano reggiano.',
        price: '$38',
        matchScore: 98,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7kHpyGIujXKp3ZHs20pPdcH3vMU0N3eEM5Cl739xeKZiV35o4-WmGCIWkloZAG8y3NxGk_9RR3CUFDt7gKH5DN2oi9qkY0gh0s4a99akqUDNCAxZqmi0AsmliXgUkEGCegcZCZ-MnqzB9WuEZV5V_hLu86tf3yyHkeebZz4jdbJ31ZJ9YcFk6bgb946bTGed3d11WoPyF2HaOjGxiOOKRl2Mxdq-KfJW6WcI8LstTFfY_mDkikBypWA'
      },
      {
        id: 'lom-2',
        name: 'Seared Scallops',
        description: 'Pan-seared sea scallops, sweet potato purée, crispy pancetta.',
        price: '$42',
        matchScore: 95,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARow8XBIFIedCjAd8ZTLR6tCQpnQdpYF46OIiHDWgNvsKlQlzoAKjF_DEXNXj75ioXw2VELIRGVzln8LlLyWfe1TEXus6wCBI8FmymsHKKFXcZAWbKOmV50uUzHDosnrAfbiSWkCVPjFevAQ0_HJ6Eznu0s6eCoC9vB9zVmaHPRx54zp_Ekp4RTcc3SU0nOyDbLFYNtEd9F8AkgUxUs-01VU-KmMJ-gLdUiTelAVUSlW3kNXgcPdG2aQ'
      },
      {
        id: 'lom-3',
        name: 'Modern Tiramisu',
        description: 'Deconstructed mascarpone, espresso sponge, dark chocolate.',
        price: '$16',
        matchScore: 92,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp_SfwVODp3oDSv97exBU9aXRisDCpbE8JVk5Y6OmcIpsiuDK9EnEB-dhEbq6bxZe9fy-X8YynvuuyNZqrLl-V64qVlUKe6lDX6L0ao1XTVhxkBONB0cz4y4YVNixIBEPp7HXKSjjnr012etDr9SamZ1Mw_Tldd2g1dRt4Bgr70VnRKdZqI0sPpOIa-_65hthlP2SNYrekzb0WacTMNXHdJITvzyTcQwqSIlKqlxIHAXb2B7M6pu1aCA'
      }
    ],
    phone: '(555) 123-4567',
    website: 'osteriamoderna.com',
    hours: '5:00 PM - 11:00 PM',
    address: 'Via del Pantheon 42, West End, Downtown, Rome',
    mapImage: ROME_MAP_IMAGE
  },
  {
    id: 'kumi-modern-japanese',
    name: 'Kumi Modern Japanese',
    cuisine: 'Asian Fusion • $$$$',
    neighborhood: 'Downtown Horizon',
    city: 'Hyderabad',
    rating: 4.9,
    reviewsCount: 384,
    priceRange: '$$$$',
    priceForTwo: '₹4,500 for two',
    distance: '1.2 mi',
    matchScore: 99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEzv6O9EUChnwzYjv-YVzn5mfNxBBi8PHb9bY0OrVjdoL6hgDHwxg2PdbxZuIvRRztf_4wRcSSQLonr8nTO7DIx8n_olI5u0gWEsiFYF3Eett6K129Xn0u2wGxYRK1GT9O-TERS0FoqyRZZcrbIykaPWZgQ1KS1ZJ7rpZiuh-YjiVfXFSEjyP5Z5GWktiKMD3tE-yodXgkrMjZgS4KN_44rnp2KemqpnSpb2wGb9u-ZotFf2s02KwbLw',
    tags: ["Matches 'Romantic Vibe'", 'Omakase Available', 'Low Noise Level', 'Date Night'],
    vibe: 'Romantic',
    vibes: ['Romantic', 'Business'],
    mustTry: 'Crispy Rice Spicy Tuna, A5 Wagyu Robata, Truffle Ponzu Sashimi',
    aiReasoning: 'Based on your desire for a quiet, romantic atmosphere with an adventurous tasting menu, Kumi perfectly aligns with your profile. We bypassed the crowded downtown spots for this intimate gem.',
    aiInsight: 'Based on your desire for a quiet, romantic atmosphere with an adventurous tasting menu, Kumi perfectly aligns with your profile. We bypassed the crowded downtown spots for this intimate gem.',
    signatureDishes: [
      {
        id: 'km-1',
        name: 'Crispy Rice Spicy Tuna',
        description: 'Golden crisped sushi rice block, tartare spicy yellowfin tuna, serrano pepper slice & sweet kabayaki.',
        price: '₹950',
        matchScore: 98,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp_SfwVODp3oDSv97exBU9aXRisDCpbE8JVk5Y6OmcIpsiuDK9EnEB-dhEbq6bxZe9fy-X8YynvuuyNZqrLl-V64qVlUKe6lDX6L0ao1XTVhxkBONB0cz4y4YVNixIBEPp7HXKSjjnr012etDr9SamZ1Mw_Tldd2g1dRt4Bgr70VnRKdZqI0sPpOIa-_65hthlP2SNYrekzb0WacTMNXHdJITvzyTcQwqSIlKqlxIHAXb2B7M6pu1aCA'
      }
    ],
    phone: '(040) 4888-9900',
    website: 'kumijapanese.com',
    hours: '6:30 PM - 12:00 AM',
    address: 'Horizon Tower 18th Floor, Financial District'
  }
];
