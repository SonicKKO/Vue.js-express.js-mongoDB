import axios from 'axios';

const refreshTime = 23 * 60 * 60 * 1000; // 23 часа в миллисекундах

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const refreshToken = async () => {
    const token = getToken();
    
    if (!token) {
        console.error('Токен отсутствует, обновление невозможно');
        return;
    }
    
    try {
        const response = await axios.post('http://localhost:5137/api/refresh-token', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.data.token) {
            setToken(response.data.token);
            return response.data.token;
        } else {
            console.error('Не удалось получить новый токен');
        }
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        throw error; 
    }
};

export const startTokenRefresh = () => {
    const intervalId = setInterval(async () => {
        try {
            await refreshToken();
            console.log('Токен успешно обновлен');
        } catch (error) {
            console.error('Ошибка при автоматическом обновлении токена:', error);
            clearInterval(intervalId);
        }
    }, refreshTime);
    
    return intervalId;
};

export const initAuth = () => {
    startTokenRefresh();
};
