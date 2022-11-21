import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { EventEmitter  } from '/src/utils/events';
import Bootstrap from '/src/core/bootstrap';

const ReactToolbarWrap = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    border-radius: 4px;
    background: white;
    padding: 12px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, .12);

    display: flex;
    gap: 12px;
`;

const EmptyToolbar = styled.div`
    font-size: 14px;
    color: #777;
    font-weight: 300;
`;

export default class ReactToolbar {
    public onContent = new EventEmitter<null>();

    constructor (private bootstrap: Bootstrap) {
        this.bootstrap.onLayout.subscribe((layout: HTMLElement) => {
            const content = this.onContent.emitParallelSync(null);

            ReactDOM.render((
                <ReactToolbarWrap>
                    {content.length === 0 ? (
                        <EmptyToolbar>No instruments available</EmptyToolbar>
                    ) : content}
                </ReactToolbarWrap>
            ), layout);
        });
    }
};
