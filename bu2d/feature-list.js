import React, { createRef, Component } from 'react'
import PropTypes from 'prop-types';
import { decorate, observable, configure, action, computed } from "mobx"
import { observer } from "mobx-react"
import i18n from "i18next";

import Dialog from '../../elements/dialog-form';
import BusStop from './../bus-stop';
import ListItemNew from '../../elements/listitem-new';

import { Swiper, Slide } from '../../modules/react-dynamic-swiper/lib'

import * as utils from '../../communicator/getShopUtils';
import * as appUtils from '../../communicator/getAppUtils';

export default class List extends Component {

    inputRef = createRef();

	constructor(props) {
		super(props);
        this.props = props;

        this.state = {
            showInput: false,
        };

        this.storeUi = this.props.storeUi;
        this.storeFeatures = this.props.storeFeatures;
    }
   
    componentDidMount() { 
        this.storeFeatures = this.props.storeFeatures;
    }

    updateInputValue = (evt) => {
	    this.setState({
	      	inputValue: evt.target.value
	    });
    }

    checkListItem = (idx, value) => {
        if (value === '') {
            this.removeListItem(idx); 
        }
    }

    addListItem = () => {
        this.setState({
            showInput: true
        })
    }

    onBlur = (evt) => {
        this.setState({
            showInput: false
        })
    }

    updateListItem = (evt, idx) => {
        let inputValueNew = evt.target.value;
        this.props.storeFeatures.changeFeatureListItem(this.props.parent_sku, 'list', inputValueNew, idx)
    }

    removeListItem = (idx) => {
        this.props.storeFeatures.removeFeatureListItem(this.props.parent_sku, 'list', idx);
    }

    updateIdValue = (evt, parent_sku, feature_sku) => {
        let inputValueNew = evt.target.value;
        this.storeFeatures.changeFeatureTitle(parent_sku, feature_sku, inputValueNew)
    }

    render() {
        i18n.changeLanguage(this.props.storeUi.app_interface.lang);
        
        const emptyList = (
            <li className="feature-list__item--empty">
                <h3>{i18n.t("helper.list_empty")}</h3>
                {/* <p>{i18n.t("helper.add_listitem")}</p> */}
            </li>
        )

        const filteredIds = this.props.storeFeatures.featuresList
            .slice()
            .filter((feature) => feature.parent_sku === this.props.parent_sku && feature.sku == (this.props.parent_sku + "_LIST"))
        
	    return (
	        <React.Fragment>
                <div className="feature-list">
                    {this.storeUi.app_interface.active_module !== 'LISTS' &&
                        <h3 className="feature-list__title">
                            {filteredIds && filteredIds[0] 
                            ?   <input value={filteredIds[0].title} onChange={evt => this.updateIdValue(evt, filteredIds[0].parent_sku, filteredIds[0].sku)} className="feature-list__title-input" />
                            :   <input value={this.props.title} onChange={evt => this.updateIdValue(evt, filteredIds[0].sku)} className="feature-list__title-input" />
                            }
                        </h3>
                    }
                       
                    <ul className="feature-list__items">

                    {filteredIds && filteredIds[0]  
                        ?   <React.Fragment>                     
                                {filteredIds[0].items.map((item, i) => (
                                    <li key={i} className="feature-list__item">
                                        <input 
                                            value={item} 
                                            onChange={evt => this.updateListItem(evt, i)} 
                                            onBlur={evt => this.checkListItem(i, evt.target.value)}
                                        />
                                        <span className="feature-list__remove-item" onClick={() => this.removeListItem(i)}>-</span>
                                    </li>
                                ))}

                                {this.state.showInput &&
                                    <li className="feature-list__item">
                                        <ListItemNew 
                                            storeFeatures = {this.props.storeFeatures}
                                            parent_sku = {this.props.parent_sku}
                                            onBlur = {this.onBlur}
                                        />
                                    </li>
                                }

                                
                            </React.Fragment>  
                    :    emptyList
                    }
                    </ul>

                    <div className="feature-list__item--empty">
                        {filteredIds && filteredIds[0] && filteredIds[0].items.length == 0 &&
                            <h3>{i18n.t("helper.list_empty")}</h3>
                        }
                        <div className="feature-list__controls feature-list__controls--add" onClick={() => this.addListItem()}></div>
                        <p>{i18n.t("helper.add_listitem")}</p>
                    </div> 
                </div>
            </React.Fragment>
	    )
    }
}
List = observer(List)

List.defaultProps = {
    title: 'Gift ideas'
};
