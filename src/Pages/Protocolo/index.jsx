import React from 'react';
import Header from '../../Components/Header';
import Aside from '../../Components/Aside';
import FormDados from '../../Components/Forms/Dados';

export default function Protocolo() {
    return (
        <div className="d-flex" style={{ height: '100vh'}}>
            {/* <Aside /> */}
            <div className="flex-grow-1 d-flex flex-column">
                <Header />
                <div className="p-4" style={{ flex: 1, overflowY: 'auto' }}>
                    <FormDados />
                </div>
            </div>
        </div>
    );
}
