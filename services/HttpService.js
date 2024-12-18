import axios from "axios";

class HttpService {
    constructor(){
        this.axios = axios.create({
            baseURL: import.meta.env.VITE_PUBLIC_API,
            timeout: 5000
        });
    }

    async post(url, data){
        try {
            const response = await this.axios.post(url, data)
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }

    async get(url){
        try {
            const response = await this.axios.get(url);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }

    async delete(url, data){
        try {
            const response = await this.axios.delete(url, data);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }

    async put(url, data){
        try {
            const response = await this.axios.put(url, data);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }

    async postToken(url, data, header){
        try {
            const response = await this.axios.post(url, data, header);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }

    async getToken(url, header){
        try {
            const response = await this.axios.get(url, header)
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }

    async deleteToken(url, data, header){
        try {
            const response = await this.axios.delete(url, data, header);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }

    async putToken(url, data, header){
        try {
            const response = await this.axios.put(url, data, header);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
}

export default HttpService;