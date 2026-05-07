import React from 'react';
import './Community.css';

const Community = () => {
    return (
        <section className="community">
            <div className="community__container">
                <h2 className="community__title">Nuestra Comunidad</h2>

                <div className="community__grid">
                    {/* TARJETA 1: INSTAGRAM */}
                    <div className="community__card">
                        <div className="community__icon-box">
                            <span className="material-symbols-outlined">photo_camera</span>
                        </div>
                        <h3>Instagram</h3>
                        <p>Seguinos para ver el arte detrás de cada pieza y nuestra curaduría diaria.</p>
                        <a href="https://instagram.com/cuyo.cebado" target="_blank" rel="noreferrer" className="community__handle">
                            @cuyo.cebado
                        </a>
                    </div>

                    {/* TARJETA 2: CANAL DE WHATSAPP */}
                    <div className="community__card">
                        <div className="community__icon-box">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <h3>Club de Cebadores</h3>
                        <p>Sumate al canal para recibir alertas de stock y beneficios exclusivos antes que nadie.</p>
                        <a href="TU_LINK_DEL_CANAL" target="_blank" rel="noreferrer" className="community__btn">
                            UNIRME AL CANAL
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Community;