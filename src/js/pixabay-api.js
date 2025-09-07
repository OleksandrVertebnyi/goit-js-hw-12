import axios from 'axios';

 const API_KEY = '51725578-d0a8f96afb46d4a0bb7439ad8';
 const BASE_URL = 'https://pixabay.com/api/';
 const PER_PAGE = 15;

 export async function getImagesByQuery(query, page = 1) {
     try {
         const response = await axios.get(BASE_URL, {
             params: {
                 key: API_KEY,
                 q: query,
                 image_type: 'photo',
                 orientation: 'horizontal',
                 safesearch: true,
                 per_page: PER_PAGE,
                page,
             },
         });
         return response.data;
     } catch (error) {
         console.error('Error fetching images:', error);
         throw error;
     }
 }


