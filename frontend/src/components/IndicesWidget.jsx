import React, { useState, useEffect } from 'react';
import { marketService } from '../services/marketService';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

const IndicesWidget = () => {
    const [indices, setIndices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIndices = async () => {
        setLoading(true);
        try {
            const data = await marketService.getIndices();
            setIndices(data);
        } catch (err) {
            console.error('Failed to fetch indices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIndices();
    }, []);

    return (
        <section className="premium-card p-6 bg-white overflow-hidden group relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Market Pulse</h3>
                    <p className="text-[10px] text-slate-400 font-bold">LIVE VIA AI SEARCH</p>
                </div>
                <button
                    onClick={fetchIndices}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                    <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {indices.map((index, i) => (
                    <div key={i} className="min-w-[140px] p-4 bg-slate-50 rounded-2xl border border-slate-100 group/item hover:border-accent transition-all">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{index.name}</div>
                        <div className="text-lg font-black text-slate-900 leading-none mb-1">
                            {index.value}
                        </div>
                        <div className="flex items-center gap-1">
                            {index.status === 'up' ? (
                                <TrendingUp className="w-3 h-3 text-accent" />
                            ) : index.status === 'down' ? (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                            ) : (
                                <Minus className="w-3 h-3 text-slate-400" />
                            )}
                            <span className={`text-[10px] font-black ${index.status === 'up' ? 'text-accent' : index.status === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                                {index.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {loading && indices.length === 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-accent animate-spin" />
                        <span className="text-[10px] font-black text-slate-900 uppercase">Consulting Markets...</span>
                    </div>
                </div>
            )}
        </section>
    );
};

export default IndicesWidget;
