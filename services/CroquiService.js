import HttpService from './HttpService';

class CroquiService extends HttpService {

    constructor() {
        super();
    };

    async getCroquiProtocolo(protocolo) {
        const response = await this.get(`/croqui/protocolo/${protocolo}/all`);
        return response;
    };

    async getAcidente(id) {
        const response = await this.get(`/acidente/${id}`);
        return response;
    };

    async getFotoAcidente(id) {
        try {
            const response = await this.get(`/foto/${id}`, {
                headers: {
                    'Content-Type': 'image/jpeg',
                },
                responseType: 'blob',
            });

            if (!response) {
                throw new Error('No data received from API');
            }

            return response;
        } catch (error) {
            console.error('Error fetching photo:', error);
            return null;
        }
    }

    async getCroquiDigital(protocolo) {
        try {
            const response = await this.get(`/croqui/protocolo/croquiDigital/${protocolo}`, {
                responseType: 'blob',
            });

        } catch (error) {
            console.error('Failed to fetch the PDF:', error);
            throw error;
        }
    };

    async postDadosUsuario(dados) {
        const response = await this.post(`/croqui/dados-do-usuario`, dados);
        return response;
    };

}

export default CroquiService;