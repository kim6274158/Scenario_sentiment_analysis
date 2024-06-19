import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import cytoscape from 'cytoscape';
import LocationContext from './LocationContext';

const RelationshipGraph = ({ sceneId }) => {
    const containerRef = useRef();
    const [data, setData] = useState({ nodes: [], edges: [] });
    const context = useContext(LocationContext);
    const cyRef = useRef(null); // Cytoscape 인스턴스를 저장할 useRef

    useEffect(() => {
        axios.post(`http://localhost:${context.serverIp}/getRelations`, { sceneId })
            .then((response) => {
                const relations = response.data;
                const nodes = [];
                const edges = [];
                const maxData = findMax(relations);

                const characters = new Set();

                relations.forEach(relation => {
                    characters.add(relation.CHARCR_ONE_ID);
                    characters.add(relation.CHARCR_TWO_ID);

                    edges.push({
                        data: {
                            source: relation.CHARCR_ONE_ID.toString(),
                            target: relation.CHARCR_TWO_ID.toString(),
                            label: maxData.RELATE_TY
                        }
                    });
                });

                characters.forEach(character => {
                    const charData = relations.find(rel => rel.CHARCR_ONE_ID === character || rel.CHARCR_TWO_ID === character);
                    if (charData) {
                        nodes.push({
                            data: {
                                id: character.toString(),
                                label: `${charData.CHARCR_ONE_ID === character ? charData.CHARCR_ONE_NAME : charData.CHARCR_TWO_NAME}`
                            }
                        });
                    }
                });

                setData({ nodes, edges });
            })
            .catch(error => {
                console.error('서버에러', error);
            });
    }, [sceneId]);

    const findMax = (data) => {
        const maxValue = Math.max(...data.map(item => item.RELATE_PT));
        return data.find(item => item.RELATE_PT === maxValue);
    };

    useEffect(() => {
        if (data.nodes.length > 0 && data.edges.length > 0) {
            // Cytoscape 인스턴스를 생성하고 저장
            cyRef.current = cytoscape({
                container: containerRef.current,
                elements: [
                    ...data.nodes,
                    ...data.edges,
                ],
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#69b3a2',
                            'label': 'data(label)',
                            'width': '50px',  // 노드의 가로 크기 조절
                            'height': '50px', // 노드의 세로 크기 조절
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,       // 엣지의 두께
                            'line-color': '#ccc',
                            'label': 'data(label)',
                        }
                    }
                ],
                layout: {
                    name: 'grid',
                    rows: 1,
                }
            });

            // 컴포넌트가 unmount될 때 Cytoscape 인스턴스 정리
            return () => {
                if (cyRef.current) {
                    cyRef.current.destroy();
                }
            };
        }
    }, [data]);

    useEffect(() => {
        // 그래프가 로드되면 화면 크기에 맞춰 리사이즈
        const handleResize = () => {
            if (cyRef.current) {
                cyRef.current.resize();
                cyRef.current.fit();
            }
        };

        // 창 크기가 변경될 때 마다 리사이즈 함수 호출
        window.addEventListener('resize', handleResize);
        
        // cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                left:'-500px',
                width: '1020px',
                height: '100%',
                position: 'absolute',
                borderRadius: '24px',
                overflow: 'hidden'
            }}
        ></div>
    );
};

export default RelationshipGraph;