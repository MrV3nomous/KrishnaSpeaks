import React, { useState, useRef, useEffect, useMemo } from 'react';
import { KNOWLEDGE_NODES } from './knowledge.js';

const UI_TEXT = {
    en: {
        title: "Krishna Speaks", subtitle: "Chant • Listen • Reflect",
        placeholder: "Seek guidance...", ask: "Ask", stop: "Stop",
        scriptures: "Library", gita: "Gita", philosophy: "Philosophy",
        search: "Search all books...",
        edit: "Edit",
        contextPrefix: "Context:", 
    },
    bn: {
        title: "কৃষ্ণ কথা", subtitle: "জপ • শ্রবণ • মনন",
        placeholder: "পথনির্দেশিকা খুঁজুন...", ask: "জিজ্ঞাসা", stop: "থামান",
        scriptures: "পবিত্র গ্রন্থ", gita: "ভগবদ্গীতা", philosophy: "দর্শন",
        search: "সর্বত্র অনুসন্ধান করুন...",
        edit: "সম্পাদনা",
        contextPrefix: "প্রসঙ্গ:", 
    },
    hi: {
        title: "कृष्ण उवाच", subtitle: "जप • श्रवण • मनन",
        placeholder: "मार्गदर्शन प्राप्त करें...", ask: "पूछें", stop: "रोकें",
        scriptures: "पवित्र ग्रंथ", gita: "भगवद्गीता", philosophy: "दर्शन",
        search: "सभी ग्रंथों में खोजें...",
        edit: "संपादित",
        contextPrefix: "संदर्भ:", 
    }
};

const TopicChip = ({ node, icon, isSelected, isLoading, isTyping, onToggle }) => {
    return (
        <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(node); }} 
            disabled={isLoading || isTyping}
            title={node.label} 
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 m-1 rounded-full text-[11px] transition-all duration-300 disabled:opacity-50 border ${
                isSelected 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 shadow-[0_2px_10px_rgba(245,158,11,0.15)]' 
                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-white/70 active:scale-95'
            }`}
        >
            <span className={isSelected ? 'opacity-100' : 'opacity-50'}>{icon}</span>
            <span className="truncate max-w-[200px]">{node.label}</span>
        </button>
    );
};

const AccordionCategory = ({ categoryName, content, globalQuery, icon = "📜", selectedTopics, isLoading, isTyping, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localQuery, setLocalQuery] = useState(''); 
    
    const filteredContent = useMemo(() => {
        if (!localQuery) return content;
        const terms = localQuery.toLowerCase().split(/\s+/).filter(Boolean);

        if (Array.isArray(content)) {
            return content.filter(node => terms.every(t => node.label.toLowerCase().includes(t)));
        } else {
            const result = {};
            Object.entries(content).forEach(([subCat, nodes]) => {
                const matchedNodes = nodes.filter(node => terms.every(t => node.label.toLowerCase().includes(t)));
                if (matchedNodes.length > 0) result[subCat] = matchedNodes;
            });
            return result;
        }
    }, [content, localQuery]);
    
    const isEmpty = Array.isArray(filteredContent) ? filteredContent.length === 0 : Object.keys(filteredContent).length === 0;

    useEffect(() => { 
        if (globalQuery && !isEmpty) setIsOpen(true); 
    }, [globalQuery, isEmpty]);

    const categoryMatchesGlobal = useMemo(() => {
        if (!globalQuery) return true;
        const terms = globalQuery.toLowerCase().split(/\s+/).filter(Boolean);
        return terms.every(term => categoryName.toLowerCase().includes(term));
    }, [categoryName, globalQuery]);

    const isHidden = !categoryMatchesGlobal && isEmpty && globalQuery;
    
    const totalItemsCount = useMemo(() => {
        if (Array.isArray(content)) return content.length;
        return Object.values(content).reduce((acc, curr) => acc + curr.length, 0);
    }, [content]);

    return (
        <div className={`mb-3 border rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-500 ${isHidden ? 'hidden' : 'block'} ${isOpen ? 'bg-white/[0.04] border-white/10 shadow-lg' : 'bg-transparent border-white/5 hover:bg-white/[0.03]'}`}>
            <div className="flex items-center justify-between px-4 py-3.5">
                <button type="button" onClick={() => setIsOpen(!isOpen)} title={categoryName} className="flex-1 text-left text-[11px] text-amber-500/90 font-semibold tracking-widest uppercase flex items-center gap-3 hover:text-amber-400 transition-colors truncate pr-2">
                    <span className={`text-[8px] opacity-60 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span> 
                    <span className="truncate">{categoryName}</span>
                </button>
            </div>
            
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-2 pt-0 flex flex-col h-full max-h-[400px]">
                        
                        {totalItemsCount > 5 && !globalQuery && (
                            <div className="px-2 pb-3 pt-1 shrink-0">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder={`Search in ${categoryName}...`}
                                        value={localQuery}
                                        onChange={(e) => setLocalQuery(e.target.value)}
                                        className="w-full bg-black/20 text-white placeholder-white/30 text-[11px] pl-8 pr-3 py-2 rounded-lg border border-white/5 focus:border-amber-500/30 focus:outline-none focus:bg-black/40 transition-all font-light"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="overflow-y-auto scrollbar-hide flex-1 relative px-1">
                            {isEmpty ? (
                                <div className="text-white/30 text-[10px] text-center py-4 font-light">No matches found in this book.</div>
                            ) : Array.isArray(filteredContent) ? (
                                <div className="flex flex-wrap">
                                    {filteredContent.map(node => (
                                        <TopicChip key={node.id} node={node} icon={icon} isSelected={selectedTopics.some(t => t.id === node.id)} isLoading={isLoading} isTyping={isTyping} onToggle={onToggle} />
                                    ))}
                                </div>
                            ) : (
                                Object.entries(filteredContent).map(([subCat, nodes]) => (
                                    <div key={subCat} className="mb-4 relative">
                                        <div className="text-[9px] text-amber-500/70 font-bold uppercase tracking-widest px-2 mb-2 mt-2 sticky top-0 bg-[#020407]/95 backdrop-blur-xl py-1.5 z-10 border-y border-white/5 rounded-sm">
                                            {subCat}
                                        </div>
                                        <div className="flex flex-wrap">
                                            {nodes.map(node => (
                                                <TopicChip key={node.id} node={node} icon={icon} isSelected={selectedTopics.some(t => t.id === node.id)} isLoading={isLoading} isTyping={isTyping} onToggle={onToggle} />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function KrishnaChat() {
    const [lang, setLang] = useState('en');
    const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hare Krishna. Welcome to the eternal realm of Vrindavan. How may I illuminate your path today?' }]);
    const [input, setInput] = useState('');
    
    const [activeTab, setActiveTab] = useState('scriptures'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userScrolledUp, setUserScrolledUp] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null); 
    
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);
    
    const animationFrameRef = useRef(null);
    const abortControllerRef = useRef(null);

    const t = UI_TEXT[lang];

    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const placeholders = useMemo(() => [
        t.search, 
        "Search 'Bhagavad Gita'...", 
        "Search 'Purushottam'...", 
        "Search 'Govardhan'...", 
        "Search 'Chapter 17'...",
        "Search 'Mahabharata'...",
        "Search 'Karma Yoga'..."
    ], [t.search]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders.length]);

    const toggleTopic = (node) => {
        setSelectedTopics(prev => 
            prev.some(t => t.id === node.id) 
            ? prev.filter(t => t.id !== node.id) 
            : [...prev, node]
        );
    };
    
    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setUserScrolledUp(scrollHeight - scrollTop - clientHeight > 50);
    };

    const scrollToBottom = () => { if (!userScrolledUp) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
    useEffect(scrollToBottom, [messages, typingText, isLoading]);

    const simulateTyping = (fullText) => {
        setIsTyping(true);
        setTypingText('');
        
        const charsPerMs = 0.25; 
        const startTime = Date.now();

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const type = () => {
            const elapsedTime = Date.now() - startTime;
            const charsToShow = Math.floor(elapsedTime * charsPerMs);

            if (charsToShow >= fullText.length) {
                setIsTyping(false);
                setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
                setTypingText('');
            } else {
                setTypingText(fullText.slice(0, charsToShow));
                animationFrameRef.current = requestAnimationFrame(type);
            }
        };

        animationFrameRef.current = requestAnimationFrame(type);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && !isTyping && (input.trim() || selectedTopics.length > 0)) handleSend();
        }
    };

    const handleStop = () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        
        setIsLoading(false);
        if (isTyping) {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'assistant', content: typingText + "..." }]);
            setTypingText('');
        }
    };

    const handleEdit = (index) => {
        const targetMsg = messages[index];
        setInput(targetMsg.rawInput || targetMsg.content); 
        setMessages(messages.slice(0, index)); 
        if (textareaRef.current) textareaRef.current.focus();
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSend = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput && selectedTopics.length === 0) return;

        const uiMessageObj = {
            role: 'user',
            content: trimmedInput,
            rawInput: trimmedInput,
            selectedContext: [...selectedTopics]
        };

        let llmPrompt = "";
        if (selectedTopics.length > 0) {
            const contextList = selectedTopics.map(node => `[${node.path.join(" > ")} > ${node.label}]`).join("\n");
            llmPrompt = `CONTEXT TAGS:\n${contextList}\n\nUSER MESSAGE: ${trimmedInput || "Please enlighten me on the selected context."}`;
        } else {
            llmPrompt = trimmedInput;
        }

        setInput('');
        setSelectedTopics([]); 
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setUserScrolledUp(false); 
        setIsMobileMenuOpen(false);

        const newMessages = [...messages, uiMessageObj];
        setMessages(newMessages);
        setIsLoading(true);
        setIsTyping(false); 

        abortControllerRef.current = new AbortController();

        try {
            const languageName = lang === 'en' ? 'English' : lang === 'bn' ? 'Bengali' : 'Hindi';
            const hiddenInstruction = `\n\n(System Note: Please weave in the main relevant Sanskrit verses in Devanagari script where applicable, and provide their translations/explanations beautifully in ${languageName}. Base your answer heavily on the provided CONTEXT TAGS if they exist.)`;
            
            const historyForApi = newMessages.slice(-6).map((m, index, array) => {
                let contentString = "";
                if (m.selectedContext && m.selectedContext.length > 0) {
                    const ctx = m.selectedContext.map(node => `[${node.path.join(" > ")} > ${node.label}]`).join("\n");
                    contentString = `CONTEXT TAGS:\n${ctx}\nUSER MESSAGE: ${m.rawInput || "Enlighten me."}`;
                } else {
                    contentString = m.content || m.rawInput;
                }

                if (index === array.length - 1 && m.role === 'user') {
                    contentString += hiddenInstruction;
                }
                return { role: m.role, content: contentString };
            });

            // UPDATED: Completely baked-in dynamic URL. No Vercel Env Vars needed.
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000'
                : 'https://krishna-speaks-api.onrender.com';

            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: llmPrompt + hiddenInstruction, history: historyForApi }),
                signal: abortControllerRef.current.signal
            });

            const data = await response.json();
            setIsLoading(false);
            if (data.reply) simulateTyping(data.reply);

        } catch (error) {
            setIsLoading(false);
            if (error.name !== 'AbortError') simulateTyping("The material energy disrupts our connection. Please try again.");
        }
    };

    const isSearching = searchQuery.trim().length > 0;
    const searchTerms = isSearching ? searchQuery.toLowerCase().split(/\s+/).filter(Boolean) : [];

    const globalFilteredNodes = useMemo(() => {
        if (!isSearching) return KNOWLEDGE_NODES;
        return KNOWLEDGE_NODES.filter(node => {
            const searchStr = `${node.path.join(" ")} ${node.label}`.toLowerCase();
            return searchTerms.every(term => searchStr.includes(term));
        });
    }, [searchTerms, isSearching]);

    const { scripturesGrouped, gitaGrouped, philosophyNodes } = useMemo(() => {
        const sc = {};
        const gi = {};
        const ph = [];

        globalFilteredNodes.forEach(node => {
            if (node.category === 'Philosophy') {
                ph.push(node);
            } else if (node.category === 'Gita') {
                const book = node.path[1];
                if (!gi[book]) gi[book] = [];
                gi[book].push(node);
            } else if (node.category === 'Library') {
                const book = node.path[1];
                const section = node.path[2];
                if (!sc[book]) sc[book] = section ? {} : [];

                if (section) {
                    if (!sc[book][section]) sc[book][section] = [];
                    sc[book][section].push(node);
                } else {
                    sc[book].push(node);
                }
            }
        });
        return { scripturesGrouped: sc, gitaGrouped: gi, philosophyNodes: ph };
    }, [globalFilteredNodes]);

    const hasAnyMatch = globalFilteredNodes.length > 0;

    return (
      <div className="flex fixed inset-0 h-screen w-screen bg-[#020407] text-white selection:bg-amber-500/30 font-sans overflow-hidden">    
            <div className="absolute top-0 left-1/4 w-[60vw] h-[50vh] bg-teal-800/15 blur-[150px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-0 w-[40vw] h-[60vh] bg-amber-700/15 blur-[160px] rounded-full pointer-events-none z-0"></div>

            <div 
                className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setIsMobileMenuOpen(false)} 
            />

            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-10 h-full w-full lg:w-[26rem]
                bg-[#020407] lg:bg-white/[0.01] backdrop-blur-3xl border-r border-white/5 p-6 lg:p-7
                shadow-[10px_0_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col
                transition-transform duration-400 ease-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                
                <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden absolute top-4 right-4 text-white/40 hover:text-amber-400 p-2 z-50 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="text-center mb-6 shrink-0 mt-6 lg:mt-0">
                    <h1 className="text-3xl font-title font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)] tracking-wide">
                        {t.title}
                    </h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mt-3 font-semibold mb-6">{t.subtitle}</p>
                    
                    <div className="flex bg-white/5 p-1 rounded-full shrink-0 shadow-inner border border-white/5 w-fit mx-auto">
                        {['en', 'hi', 'bn'].map(l => (
                            <button key={l} onClick={() => setLang(l)} className={`text-[10px] px-5 py-1.5 rounded-full transition-all font-semibold tracking-wider ${lang === l ? 'bg-amber-500/90 text-black shadow-md' : 'text-white/40 hover:text-white/80'}`}>
                                {l === 'en' ? 'ENG' : l === 'hi' ? 'हिंदी' : 'বাংলা'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl mb-6 shrink-0 shadow-inner border border-white/5">
                    <button onClick={() => {setActiveTab('scriptures'); setSearchQuery('');}} className={`py-2 px-1 text-[9.5px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 truncate ${activeTab === 'scriptures' && !isSearching ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}>{t.scriptures}</button>
                    <button onClick={() => {setActiveTab('gita'); setSearchQuery('');}} className={`py-2 px-1 text-[9.5px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 truncate ${activeTab === 'gita' && !isSearching ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}>{t.gita}</button>
                    <button onClick={() => {setActiveTab('philosophy'); setSearchQuery('');}} className={`py-2 px-1 text-[9.5px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 truncate ${activeTab === 'philosophy' && !isSearching ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}>{t.philosophy}</button>
                </div>

                <div className="relative shrink-0 mb-6 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-30 group-focus-within:opacity-80 group-focus-within:text-amber-400 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder={placeholders[placeholderIndex]} 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] text-white placeholder-white/30 text-[13px] pl-11 pr-4 py-3.5 rounded-2xl border border-white/5 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all font-light" 
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
                    {isSearching && <div className="text-[10px] text-amber-500/50 uppercase tracking-widest mb-4 font-bold px-2">Global Search Results</div>}

                    {(activeTab === 'scriptures' || isSearching) && (
                        Object.entries(scripturesGrouped).map(([category, content]) => (
                            <AccordionCategory key={category} categoryName={category} content={content} globalQuery={searchQuery} icon="📜" selectedTopics={selectedTopics} isLoading={isLoading} isTyping={isTyping} onToggle={toggleTopic} />
                        ))
                    )}

                    {(activeTab === 'gita' || isSearching) && (
                        Object.entries(gitaGrouped).map(([book, content]) => (
                            <AccordionCategory key={book} categoryName={book} content={content} globalQuery={searchQuery} icon="🪷" selectedTopics={selectedTopics} isLoading={isLoading} isTyping={isTyping} onToggle={toggleTopic} />
                        ))
                    )}

                    {(activeTab === 'philosophy' || isSearching) && (
                        philosophyNodes.length > 0 && (
                            <div className="mt-1 flex flex-wrap">
                                {philosophyNodes.map(node => <TopicChip key={node.id} node={node} icon="✨" isSelected={selectedTopics.some(t => t.id === node.id)} isLoading={isLoading} isTyping={isTyping} onToggle={toggleTopic} />)}
                            </div>
                        )
                    )}

                    {isSearching && !hasAnyMatch && (
                        <div className="text-white/30 text-xs text-center mt-10 font-light animate-in fade-in">No matching wisdom found.</div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full relative z-10 bg-transparent">
                
                <div className="lg:hidden w-full bg-[#020407]/80 backdrop-blur-2xl border-b border-white/5 p-4 flex justify-between items-center z-30 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-amber-500 p-1 relative z-50">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <h2 className="text-xl font-title font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-sm">{t.title}</h2>
                    <div className="w-7"></div>
                </div>

                <div className="flex-1 overflow-y-auto pt-8 pb-6 px-4 lg:px-8 scroll-smooth scrollbar-hide" ref={chatContainerRef} onScroll={handleScroll}>
                    <div className="max-w-4xl mx-auto space-y-6 flex flex-col w-full pb-40">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col w-full group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                
                                <div className="flex items-center gap-3 mb-1.5 ml-1 mr-1">
                                    <span className={`text-[9px] uppercase tracking-[0.2em] font-semibold ${msg.role === 'user' ? 'text-white/30' : 'text-amber-500/70'}`}>
                                        {msg.role === 'user' ? 'You' : 'Sri Krishna'}
                                    </span>
                                    {msg.role === 'user' && (
                                        <button onClick={() => handleEdit(idx)} className="text-white/20 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] uppercase font-bold bg-white/5 px-2 py-0.5 rounded-full" title={t.edit}>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                    )}
                                </div>
                                
                                <div className="relative group/bubble max-w-[92%] lg:max-w-[85%]">
                                    <div className={`w-fit break-words whitespace-pre-wrap shadow-lg backdrop-blur-2xl ${
                                        msg.role === 'user' 
                                            ? 'bg-white/[0.04] text-white/90 rounded-2xl rounded-tr-sm border border-white/[0.08] font-normal text-[14px] leading-relaxed overflow-hidden' 
                                            : 'px-6 py-4 bg-gradient-to-br from-[#120803] to-[#0A0502] text-amber-50/95 rounded-2xl rounded-tl-sm border border-amber-900/30 shadow-[0_4px_20px_rgba(217,119,6,0.08)] font-krishna text-[15px] leading-relaxed tracking-wide'
                                    }`}>
                                        
                                        {msg.role === 'user' && msg.selectedContext && msg.selectedContext.length > 0 && (
                                            <div className="bg-amber-500/10 border-b border-white/5 px-4 py-2.5 flex flex-wrap gap-1.5 items-center">
                                                <span className="text-[9px] text-amber-400/80 uppercase tracking-widest font-bold mr-1">{t.contextPrefix}</span>
                                                {msg.selectedContext.map(node => (
                                                    <span key={node.id} title={node.path.join(" > ")} className="text-[10px] text-amber-200 bg-black/30 px-2 py-0.5 rounded border border-amber-500/20 truncate max-w-[200px] cursor-help">
                                                        {node.label}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {msg.role === 'user' ? (
                                            msg.rawInput && (
                                                <div className="px-5 py-3.5">
                                                    {msg.rawInput}
                                                </div>
                                            )
                                        ) : (
                                            msg.content
                                        )}
                                    </div>

                                    {msg.role === 'assistant' && (
                                        <button 
                                            onClick={() => handleCopy(msg.content, idx)}
                                            className="absolute -right-10 bottom-1 p-2 text-white/20 hover:text-amber-400 opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 bg-white/5 backdrop-blur-md rounded-full border border-white/5"
                                            title="Copy text"
                                        >
                                            {copiedIndex === idx ? (
                                                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            ) : (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && !isTyping && (
                            <div className="flex flex-col w-full items-start animate-in fade-in duration-500">
                                <span className="text-[9px] text-amber-500/70 mb-1.5 ml-1 uppercase tracking-[0.25em] font-semibold">Sri Krishna</span>
                                <div className="px-6 py-5 rounded-2xl rounded-tl-sm w-fit bg-gradient-to-br from-[#120803] to-[#0A0502] backdrop-blur-2xl border border-amber-900/30 shadow-[0_4px_20px_rgba(217,119,6,0.08)] flex items-center justify-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-[bounce_1.4s_infinite_ease-in-out_both]" style={{ animationDelay: '-0.32s' }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-[bounce_1.4s_infinite_ease-in-out_both]" style={{ animationDelay: '-0.16s' }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-[bounce_1.4s_infinite_ease-in-out_both]"></div>
                                </div>
                            </div>
                        )}

                        {isTyping && (
                            <div className="flex flex-col w-full items-start animate-in fade-in duration-500">
                                <span className="text-[9px] text-amber-500/70 mb-1.5 ml-1 uppercase tracking-[0.25em] font-semibold">Sri Krishna</span>
                                <div className="px-6 py-4 rounded-2xl rounded-tl-sm w-fit max-w-[92%] break-words bg-gradient-to-br from-[#120803] to-[#0A0502] backdrop-blur-2xl text-amber-50/95 border border-amber-900/30 shadow-[0_4px_20px_rgba(217,119,6,0.08)] font-krishna text-[15px] leading-relaxed tracking-wide">
                                    {typingText}<span className="animate-pulse border-r-2 border-amber-400 ml-1"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-6" />
                    </div>
                </div>

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#020407] via-[#020407]/95 to-transparent pt-16 pb-6 px-4 z-20 pointer-events-none">
                    <div className="max-w-4xl mx-auto w-full flex flex-col justify-end pointer-events-auto">
                        
                        {selectedTopics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3 px-2 max-h-[80px] overflow-y-auto scrollbar-hide">
                                {selectedTopics.map(node => (
                                    <span key={node.id} title={node.path.join(" > ")} className="text-[10px] font-medium tracking-wide bg-amber-500/20 backdrop-blur-3xl border border-amber-500/40 text-amber-100 px-2.5 py-1 rounded flex items-center gap-2 shadow-[0_4px_15px_rgba(245,158,11,0.1)] max-w-full">
                                        <span className="truncate">{node.label}</span>
                                        <button onClick={() => toggleTopic(node)} className="text-amber-400/60 hover:text-white transition-colors shrink-0">✕</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-end gap-2 bg-white/[0.02] backdrop-blur-3xl p-2 rounded-3xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] focus-within:border-white/20 focus-within:bg-white/[0.04] transition-all duration-500">
                            <textarea
                                ref={textareaRef} value={input} onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 130)}px`; }} onKeyDown={handleKeyDown} disabled={isLoading || isTyping}
                                placeholder={selectedTopics.length > 0 ? "Ask about these topics..." : t.placeholder}
                                className="flex-1 bg-transparent text-white placeholder-white/30 px-4 py-3 focus:outline-none disabled:opacity-50 text-[14px] resize-none overflow-hidden min-h-[44px] rounded-xl font-normal leading-relaxed" rows={1}
                            />
                            {(isLoading || isTyping) ? (
                                <button onClick={handleStop} className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 font-semibold px-5 py-2.5 mb-0.5 rounded-2xl transition-all h-[44px] flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg> <span className="hidden sm:inline text-sm">{t.stop}</span>
                                </button>
                            ) : (
                                <button onClick={() => handleSend()} disabled={!input.trim() && selectedTopics.length === 0} className="bg-amber-500 text-[#020407] font-semibold px-6 py-2.5 mb-0.5 rounded-2xl transition-all duration-300 hover:bg-amber-400 hover:scale-[0.98] active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.15)] h-[44px] text-sm tracking-wide">
                                    {t.ask}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}