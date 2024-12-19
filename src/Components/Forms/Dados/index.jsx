import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CroquiService from '../../../../services/CroquiService';
const croquiService = new CroquiService();
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const VITE_PUBLIC_API = import.meta.env.VITE_PUBLIC_API;

export default function FormDados() {
    const location = useLocation();
    const { dados } = location.state || {};
    const [acessoEm, setAcessoEm] = useState(null);
    const printRef = useRef(null);
    const [fotosUrls, setFotosUrls] = useState([]);
    const [pdfUrls, setPdfUrls] = useState([]);
    const [ipAddress, setIpAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIp = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIpAddress(data.ip);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIp();
    }, []);

    useEffect(() => {
        setAcessoEm(new Date());
    }, []);


    useEffect(() => {
        const fetchPdf = async () => {
            try {
                if (dados?.croqui?.[0]?.croquiDigital === null) {
                    setPdfUrls(null)
                }

                const response = await axios.get(
                    `${VITE_PUBLIC_API}/croqui/protocolo/croquiDigital/${dados.protocolo}`,
                    { responseType: 'blob' }
                );

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrls(url);
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };

        if (dados.protocolo) {
            fetchPdf();
        }
        return () => {
            if (pdfUrls) {
                URL.revokeObjectURL(pdfUrls);
            }
        };
    }, [dados.protocolo]);


    useEffect(() => {
        const fotos = dados?.croqui?.[0]?.acidente?.fotos || [];

        const fetchFotos = async () => {
            try {
                const requests = fotos.map((foto) =>
                    axios.get(`${VITE_PUBLIC_API}/foto/${foto.id}`, {
                        responseType: "blob",
                    })
                );

                const responses = await Promise.all(requests);

                const urls = responses.map((response) => {
                    const blob = new Blob([response.data], { type: "image/jpeg" });
                    return URL.createObjectURL(blob);
                });

                setFotosUrls(urls);
            } catch (error) {
                console.error("Error fetching fotos as Blobs:", error);
            }
        };

        if (fotos.length > 0) {
            fetchFotos();
        }
    }, [dados]);

    useEffect(() => {
        return () => {
            fotosUrls.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };

    }, [fotosUrls]);

    const handlePrint = () => {
        if (printRef.current) {
            const images = printRef.current.querySelectorAll('img');
            const imagePromises = Array.from(images).map(img => {
                return new Promise((resolve) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                        img.onerror = resolve;
                    }
                });
            });

            Promise.all(imagePromises).then(() => {
                const printContent = printRef.current.innerHTML;
                const printWindow = window.open('', '_blank');
                printWindow.document.open();
                printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${dados.protocolo}</title>
          <style>
        @media print {
        @page {
          size: A4;
           margin: 20mm 10mm 20mm 10mm;
        }
        
        @page:first {
          margin-top: 15mm;
        }
        
        @page:left {
          @top-center {
            content: "Registro de Sinistro de Trânsito (REST) - Protocolo: ${dados.protocolo}";
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #555;
          }
        }
        
        @page:right {
          @top-center {
            content: "Registro de Sinistro de Trânsito (REST) - Protocolo: ${dados.protocolo}";
            font-family: Arial, sans-serif;
            font-size: 10pt;
            color: #555;
          }
        }
        
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          width: 100%;
        }
        
        .print-content {
          padding: 20mm;
        }
        
        .print-header {
          display: none;
        }
    }

        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          line-height: 1.6;
        }
        h4 {
            font-size: 22px;
            margin-bottom: 15px;
        }
        h3 {
            font-size: 19px
        }
        table {
          width: 100%;
          border-collapse: separate !important;
          margin: 20px 0;
          background-color: #fff;
          max-width: 100%;
          table-layout: fixed;
          box-sizing: border-box;
        }
        th, td {
          padding: 12px;
          border: 0.5px solid #f4f4f4;
          text-align: left;
          word-wrap: break-word; 
          overflow: visible;
         -webkit-print-color-adjust: exact;
        }
       
        @media print {
          body {
            width: 100%;
          }
          .print-image-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
            gap: 10px;
            page-break-inside: avoid;
          }
          .print-image-wrapper {
            width: calc(50% - 10px);
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ddd;
            box-sizing: border-box;
            page-break-inside: avoid;
            margin-bottom: 10px;
          }
          .print-image-wrapper img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          img {
          max-width: 100% !important;
          max-height: 400px !important;
          object-fit: contain !important;
          }
        }
          </style>
        </head>
        <body>
            <div class="print-header">
            <h2>Registro de Sinistro de Trânsito (REST)</h2>
            <h3>Protocolo: ${dados.protocolo}</h3>
            </div>
            <div class="page-content">
            ${printContent}
            </div>
        </body>
        </html>
      `);
                printWindow.document.close();
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            });
        }
    };

    const subtractHours = (date, hours) => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() - hours);
        return newDate;
    };

    const updatedHoraDownload = subtractHours(acessoEm, 3);

    const formattedHoraDownload = updatedHoraDownload.toISOString();

    const handleClick = async () => {
        try {
            const response = await croquiService.postDadosUsuario({
                'ipUsuario': ipAddress,
                'protocolo': dados.protocolo,
                'data_download': acessoEm,
                'hora_download': formattedHoraDownload,
            });
        } catch (error) {
            console.error(error);
        }
        handlePrint();
    };

    const handleVoltar = () => {
        navigate('/')
    };


    if (!dados) {
        return <p>Nenhum dado para mostrar.</p>;
    }

    function formatAcessoEm(value) {
        if (!value) return '';

        const date = new Date(value);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        return date.toLocaleString('pt-BR', options);
    }

    const formatValue = (value) => {
        if (value === null || value === undefined) return 'Indisponível';
        if (typeof value === 'boolean') {
            return value ? 'Sim' : 'Não';
        }
        if (value instanceof Date ||
            (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value))) {
            return new Date(value).toLocaleString('pt-BR', {
                dateStyle: 'short',
            });
        }

        if (Array.isArray(value) && value.length > 0 && value[0].nome) {
            return value.map(item => item.nome).join(', ');
        }

        if (typeof value === 'object') {
            return (
                <table style={{ border: '1px solid #ddd', margin: '10px 0', width: '100%' }}>
                    <tbody>
                        {Object.entries(value).map(([key, val]) => (
                            <tr key={key}>
                                <td style={{ fontWeight: 'bold', padding: '5px', backgroundColor: '#f9f9f9' }}>{key}</td>
                                <td style={{ padding: '5px' }}>{formatValue(val)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        return value?.toString() || 'N/A';
    };

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('pt-BR');
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function formatCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');

        if (cleanCPF.length !== 11) return 'CPF inválido';

        return `${cleanCPF.slice(0, 3)}******${cleanCPF.slice(9)}`;
    }

    function formatEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Invalid Email';

        const [localPart, domain] = email.split('@');

        if (localPart.length <= 3) {
            return `${localPart}******@${domain}`;
        }

        return `${localPart.slice(0, 3)}******${localPart.slice(-2)}@${domain}`;
    }

    const renderMultipleItems = (arrayKey, titlePrefix, dataExtractor) => {
        let items;

        try {
            switch (arrayKey) {
                case 'dados':
                    items = dados ? [dados] : [];
                    break;
                case 'dados.croqui[0].acidente.veiculos':
                    items = dados?.croqui?.[0]?.acidente?.veiculos || [];
                    break;
                case 'croqui[0].acidente.condutores':
                    items = dados?.croqui?.[0]?.acidente?.condutores || [];
                    break;
                case 'croqui?.[0]?.vitimas':
                    items = dados.croqui[0].acidente.vitimas || [];
                    break;
                case 'croqui?.[0]?.testemunha':
                    items = dados.croqui[0].acidente.testemunha || [];
                    break;
                case 'EnderecoAcidente':
                    items = dados?.EnderecoAcidente || [];
                    break;
                case 'orgaos_presentes':
                    items = dados?.orgaos_presentes || [];
                    break;
                case 'tipoVestigio':
                    items = dados?.tipoVestigio || [];
                    break;
                case 'pneumatico':
                    items = dados?.pneumatico || [];
                    break;
                default:
                    items = [];
            }

            items = Array.isArray(items) ? items : (items ? [items] : []);

            if (items.length === 0) {
                return <p>Nenhum(a) {titlePrefix} cadastrado(a).</p>;
            }

            return items.map((item, index) => {
                const itemData = dataExtractor(item);
                const uniqueKey = `${titlePrefix}-${item?.id || index}`;

                const displayTitle = items.length > 1
                    ? `${titlePrefix} ${index + 1}`
                    : titlePrefix;

                return renderTable(displayTitle, itemData, uniqueKey);
            });
        } catch (error) {
            return <p>Erro ao carregar {titlePrefix}.</p>;
        }
    };

    const dadosAcidente = (acidente) => ({
        'Bairro': acidente.bairro,
        'Cidade': acidente.cidade,
        'UF': acidente.uf,
        'Latitude': acidente.lat,
        'Longitude': acidente.longi,
        'Referência': acidente.referencia,
        'Data do Ocorrido': formatDate(acidente.data_ocorrido),
        'Hora': formatTime(acidente.hora),
        'Data de Cadastro': formatDate(acidente.data_cadastro),
        'Última Atualização': formatDate(acidente.ultima_atualizacao),
        'Tipo de Acidente': acidente.tipo_acidente,
        'Veículos Retirados': acidente.veiculos_retirados,
        'Veículos Recolhidos': acidente.veiculos_recolhidos,
        'Infração': acidente.infracao,
        'Sugestões de Melhorias': acidente.sugestoes_melhorias,
        'Origem': acidente.origem,
        'Versão': acidente.versao,
        'Falta de Sinalização': acidente.falta_sinalizacao,
        'Reforços': acidente.reforcos,
        'Protocolo': acidente.protocolo
    });

    const dadosVeiculos = (veiculo) => {
        // Create base vehicle data
        const baseData = {
            'Placa': veiculo.placa,
            'Tipo': veiculo.tipo,
            'Marca': veiculo.marca,
            'Cor': veiculo.cor,
            'Modelo': veiculo.modelo,
            'Transporte': veiculo.transporte,
            'Status': veiculo.status,
            'Agente Recolhimento': veiculo.Agente_Recolhimento ? {
                'Nome': veiculo.Agente_Recolhimento.nome,
                'Matrícula': veiculo.Agente_Recolhimento.matricula,
                'Órgão Presente': veiculo.Agente_Recolhimento.orgao_agente_presente?.nome
            } : null,
            'Condutor': veiculo.condutor ? {
                'Nome': veiculo.condutor.nome,
                'CPF': formatCPF(veiculo.condutor.cpf),
                'Idade': veiculo.condutor.idade,
                'Sexo': veiculo.condutor.sexo,
                'Email': formatEmail(veiculo.condutor.email),
                'Vítima': veiculo.condutor.ehVitima,
            } : null,
            'Vestígios': veiculo.tipoVestigio?.[0] ? {
                'Distancia': veiculo.tipoVestigio[0].distancia,
                'Tipo': veiculo.tipoVestigio[0].tipo,
                'Veículo Identificado': veiculo.tipoVestigio[0].veiculoIdentificado,
            } : null,
            'Pneumático': veiculo.pneumatico?.[0] ? {
                'Subtipo': veiculo.pneumatico[0].subtipo,
                'Distancia': veiculo.pneumatico[0].distancia,
                'Superficie': veiculo.pneumatico[0].superficie,
                'Veículo Identificado': veiculo.pneumatico[0].veiculoIdentificado,
            } : null,
        };
    
        if (veiculo.vitimas && veiculo.vitimas.length > 0) {
            if (veiculo.vitimas.length === 1) {
                baseData['Vítima'] = {
                    'Nome': veiculo.vitimas[0].nome,
                    'CPF': formatCPF(veiculo.vitimas[0].cpf),
                    'Idade': veiculo.vitimas[0].idade,
                    'Sexo': veiculo.vitimas[0].sexo,
                    'Atendimento': veiculo.vitimas[0].atendimento,
                    'Condição': veiculo.vitimas[0].condicao,
                };
            } else {
                veiculo.vitimas.forEach((vitima, index) => {
                    baseData[`Vítima ${index + 1}`] = {
                        'Nome': vitima.nome,
                        'CPF': formatCPF(vitima.cpf),
                        'Idade': vitima.idade,
                        'Sexo': vitima.sexo,
                        'Atendimento': vitima.atendimento,
                        'Condição': vitima.condicao,
                    };
                });
            }
        }
    
    
        return baseData;
    };

    const dadosCondutores = (condutor) => ({
        'Nome': condutor.nome,
        'CPF': formatCPF(condutor.cpf),
        'Idade': condutor.idade,
        'Sexo': condutor.sexo,
        'Email': formatEmail(condutor.email),
        'Vítima': condutor.ehVitima,
        'Descrição': condutor.descricao?.[0]?.descricao
    });

    const dadosTipoVestigio = (vestigio) => ({
        'Tipo': vestigio.tipo,
        'Distância (m)': vestigio.distancia,
        'Veículo Identificado': vestigio.veiculoIdentificado ? 'Sim' : 'Não',
    });

    const dadosPneumatico = (pneumatico) => ({
        'Subtipo': pneumatico.subtipo,
        'Distância (m)': pneumatico.distancia,
        'Superfície': pneumatico.superficie,
        'Veículo Identificado': pneumatico.veiculoIdentificado ? 'Sim' : 'Não'
    });

    const dadosTestemunhas = (testemunha) => ({
        'Nome': testemunha.nome,
        'Descrição': testemunha.descricao?.[0]?.descricao,
    });

    const dadosVitimas = (vitimas) => ({
        "CPF": formatCPF(vitimas.cpf),
        "Nome": vitimas.nome,
        "Idade": vitimas.idade,
        "Sexo": vitimas.sexo,
        "Atendimento": vitimas.atendimento,
        "Condição": vitimas.condicao,
        "Veículo Identificado": vitimas.veiculo_id ? 'Sim' : 'Não'
    });

    const dadosEndereco = (endereco) => ({
        'Rua': endereco.rua,
        'Pavimento': endereco.pavimento,
        'Sinalização': endereco.sinalizacao ? endereco.sinalizacao.join(', ') : 'N/A'
    });

    const dadosAgentes = () => ({
        'Agente de Cadastro': dados.agente_cadastro?.nome,
        'Agente da Última Edição': dados.agente_ultima_edicao?.nome
    });

    const dadosOutrosOrgaos = () => ({
        'Órgâos Presentes': dados?.orgaos_presentes,
        'Órgão Solicitador': dados.orgao_solicitador?.nome,
        'Primeiro Atendimento': dados.primeiro_atendimento?.nome
    });

    const renderTable = (title, data, uniqueKey) => (
        <div key={uniqueKey} style={{
            marginBottom: '30px', overflowX: 'visible',
            width: '100%'
        }}>
            <h3 style={{
                textAlign: 'left',
                marginBottom: '15px',
                color: '#333',
                borderBottom: '2px solid #f4f4f4',
                paddingBottom: '10px',
                fontSize: '19px'
            }}>{title}</h3>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    margin: '20px auto',
                    backgroundColor: '#fff',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', width: '40%' }}>Campo</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd', width: '60%' }}>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#333' }}>{key}</td>
                            <td style={{ padding: '10px', color: '#555' }}>{formatValue(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        !pdfUrls ? (
            <div
                style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#666',
                    fontSize: '18px'
                }}
            >
                Croqui em análise. Tente novamente mais tarde.
            </div>
        ) : (
            <div ref={printRef}
                style={{
                    padding: '20px',
                    lineHeight: 1.6,
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: '#2c3e50',
                        borderBottom: '3px solid #3498db',
                        paddingBottom: '10px',
                        fontSize: '27px'
                    }}>Registro de Sinistro de Trânsito (REST)</h2>
                    <h3 style={{ color: '#555', fontSize: '27px' }}>Protocolo: {dados.protocolo}</h3>
                </header>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Dados do Acidente</h4>
                    {renderMultipleItems(
                        'dados',
                        '',
                        dadosAcidente
                    )}
                </div>

                <div style={{ marginTop: '30px', }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Veículos</h4>
                    {renderMultipleItems(
                        'dados.croqui[0].acidente.veiculos',
                        'Veículo',
                        dadosVeiculos
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Vestígios</h4>
                    {renderMultipleItems(
                        'tipoVestigio',
                        'Vestígio',
                        dadosTipoVestigio
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Pneumáticos</h4>
                    {renderMultipleItems(
                        'pneumatico',
                        'Pneumático',
                        dadosPneumatico
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Condutores</h4>
                    {renderMultipleItems(
                        'croqui[0].acidente.condutores',
                        'Condutor',
                        dadosCondutores
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Vítimas</h4>
                    {renderMultipleItems(
                        'croqui?.[0]?.vitimas',
                        'Vítimas',
                        dadosVitimas
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Testemunhas</h4>
                    {renderMultipleItems(
                        'croqui?.[0]?.testemunha',
                        'Testemunha',
                        dadosTestemunhas
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Endereço</h4>
                    {renderMultipleItems(
                        'EnderecoAcidente',
                        'Endereço',
                        dadosEndereco
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Órgãos Envolvidos</h4>
                    {renderMultipleItems(
                        'dados',
                        '',
                        dadosOutrosOrgaos
                    )}
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Agentes de Trânsito</h4>
                    {renderMultipleItems(
                        'dados',
                        '',
                        dadosAgentes
                    )}
                </div>

                <div style={{ marginTop: '30px', pageBreakBefore: 'always' }}>
                    <h3
                        style={{
                            textAlign: 'center',
                            marginBottom: '15px',
                            color: '#333',
                            borderBottom: '2px solid #f4f4f4',
                            paddingBottom: '10px',
                            fontSize: '25px',
                        }}
                    >
                        Fotos do Acidente
                    </h3>

                    <div
                        className="print-image-container"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '15px',
                            border: '1px solid #ddd',
                            padding: '15px',
                            marginBottom: '15px',
                            borderRadius: '5px'
                        }}
                    >
                        {fotosUrls.length > 0 ? (
                            fotosUrls.map((url, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="image-wrapper"
                                        style={{
                                            width: '45%',
                                            margin: '10px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '400px',
                                            border: '1px solid #eee'
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`Foto ${index + 1}`}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <p>Nenhuma foto carregada.</p>
                        )}
                    </div>
                </div>

                {dados.croqui && dados.croqui.length > 0 && (
                    <div style={{ marginTop: '30px', pageBreakBefore: 'always' }}>
                        <h3 style={{
                            textAlign: 'center',
                            marginBottom: '15px',
                            color: '#333',
                            borderBottom: '2px solid #f4f4f4',
                            paddingBottom: '10px',
                            fontSize: '25px'
                        }}>Detalhes do Croqui</h3>

                        {dados.croqui.map((item, index) => (
                            <div key={item.id} style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                marginBottom: '20px',
                                borderRadius: '5px'
                            }}>
                                <p><strong>ID do Croqui:</strong> {item.id}</p>
                                <p><strong>Acesso em:</strong> {formatAcessoEm(acessoEm)}</p>
                            </div>
                        ))}
                    </div>
                )
                }

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px'
                }}>
                    <button
                        onClick={handleClick}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#3498db',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}>
                        Imprimir relatório
                    </button>

                    <a
                        href={pdfUrls}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#3498db',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                            textDecoration: 'none'
                        }}>
                        Baixar Croqui Digital
                    </a>
                </div>


                <button
                    onClick={handleVoltar}
                    style={{
                        display: 'block',
                        margin: '10px auto',
                        padding: '12px 20px',
                        backgroundColor: '#605e5e',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.3s ease',
                    }}>
                    Voltar
                </button>
            </div >
        )
    );


}