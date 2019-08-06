import React, { Component } from 'react';

import ResumeAbout from './about';
import CardTeasers from '../cards/card-teasers';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'

class ResumeSections extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps !== prevState) {
            return {
                data: nextProps.data
            };
        }
        else return null;
    }

    renderLevel(level) {
        console.log('SbC level::', level)
        const n = 5;

        const levelIcons = (
            [...Array(n)].map((e, i) => 
                <React.Fragment>
                    {i <= (level - 1) &&
                        <FontAwesomeIcon icon={faStar} color="green" />
                    }
                     {i > (level - 1) &&
                        <FontAwesomeIcon icon={faStar} color="#525252" />
                    }
                </React.Fragment>
            )
        )

        return (
            <span className="resume__item-descr">
                {levelIcons}
            </span>
        )
    }

    listSkillsData(data) {
        const skillsData = (
            <React.Fragment>
                {data.value.map((values) => {
                    return (typeof values === 'object') && 
                        <React.Fragment>
                            {Object.keys(values).map((key) => {
                                return (
                                    <React.Fragment>
                                        <ul className="data__list--skills-expertise">
                                            <li>
                                                <span className="resume__item-title">{values[key].title}</span>
                                            </li>
                                            {values[key].exp_level &&
                                            <li>
                                                {this.renderLevel(values[key].exp_level)}
                                            </li> 
                                            }
                                            {values[key].exp_years &&
                                            <li>
                                                <span className="resume__item-descr">
                                                    {/* <FontAwesomeIcon icon="calendar" /> */}
                                                    {values[key].exp_years} years
                                                </span>
                                            </li>
                                        }
                                        </ul>
                                    </React.Fragment>
                                )
                            })}
                        </React.Fragment>
                })}
            </React.Fragment>
        )
  
        return skillsData;
    }

    listProjectKeyData(data) {
        const projectKeyData = Object.keys(data).map((key) => {
            return (
                <React.Fragment>
                    {key == 'project' &&
                        <span className="data__subtitle">{data[key]}</span>
                    }

                    {key == 'descr' &&
                        <span className="data__descr">{data[key]}</span>
                    }

                    {key == 'url' && data[key] &&
                        <React.Fragment>
                            <h4>Url</h4>
                            <span className="data__descr">{data[key]}</span>
                            </React.Fragment>
                    } 
                 </React.Fragment>
            )
        });
        return projectKeyData;
    }
    
    listProjectSpecs(data) {
        const projectData = Object.keys(data).map((key) => {
            console.log('SbC data::', key, data[key])
            return (
                <React.Fragment>
                     {key == 'category' &&
                        <li className="data__list-item--order-1">
                            <h4>Category</h4>
                            <span className="data__specs">{data[key]}</span>
                        </li>
                    } 
                    
                    {key == 'techniques' &&
                        <li>
                            <h4>Techniques</h4>
                            <ul>
                                {data[key].map((value) => (
                                    <li className="data__specs">{value}</li>
                                ))}
                            </ul>
                        </li>
                    } 

                    {key == 'tags' &&
                        <li>
                            <h4>Tags</h4>
                            <ul>
                                {data[key].map((value) => (
                                    <li className="data__specs">{value}</li>
                                ))}
                            </ul>
                        </li>
                    } 

                    {key == 'status' &&
                        <li>
                            <h4>Status</h4>
                            <span className="data__specs">{data[key]}</span>
                        </li>
                    }           
               </React.Fragment>
            )
        });
        return projectData;
    }

    listSectionData() {
        const listDefault = Object.keys(this.state.data.data).map((key) => {
            return (
                <React.Fragment>
                    <li className="resume-item">
                        <dl>
                            <dt className="resume-item__identifier">
                                {this.state.data.data[key].title}
                            </dt>
                            <dd className="resume-item__data">
                                {!Array.isArray(this.state.data.data[key].value) 
                                ?   <React.Fragment>
                                        <span className="data__title">
                                            {this.state.data.data[key].value}
                                        </span>
                                        
                                        {this.props.section == 'projects' || this.props.section == 'own_productions'
                                            ?   <React.Fragment>
                                                    {this.listProjectKeyData(this.state.data.data[key])}
                                                    <ul className="data__list--project-specs">
                                                        {this.listProjectSpecs(this.state.data.data[key])}
                                                    </ul>
                                                </React.Fragment>
                                            :   <React.Fragment>
                                                    {this.listProjectKeyData(this.state.data.data[key])}
                                                </React.Fragment>
                                        }
                                    </React.Fragment>
                
                                :   <React.Fragment>
                                        {this.props.section == 'skills'
                                        ?
                                            this.listSkillsData(this.state.data.data[key])
                                        :                            
                                            <ul>
                                                {this.state.data.data[key].value.map((values) => {
                                                    return (typeof values === 'object') 
                                                        ?   <li>
                                                                <dl>
                                                                {Object.keys(values).map((key) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <dt>{values[key].title}</dt>
                                                                            <dd>
                                                                                <span className="resume__item-title">
                                                                                    {values[key].value}
                                                                                </span>
                                                                                {values[key].descr &&
                                                                                    <span className="resume__item-descr">{values[key].descr}</span>
                                                                                }
                                                                            </dd>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                                </dl>
                                                            </li>
                                                        :   <li>{values}</li>;
                                                })}
                                            </ul>
                                        }
                                    </React.Fragment>
                                }
                            </dd>
                        </dl>
                    </li>
                </React.Fragment>
            )
        });

        let component = null;
        switch(this.props.section) {
            case 'aboutxx':
                component = <ResumeAbout />;
                break;
            default:
                component = <ul className="list--section">{listDefault}</ul>
        }

        return component;
    }
  
    render() {
        const sectionClass = ('card__content resume-' + this.props.section);

        const sectionTitle = Object.keys(this.state.data).map((key) => {
            return (key == 'title') 
            ?   this.state.data[key] 
            :   null;
        });

        const sectionList = Object.keys(this.state.data).map((key) => {
            return (
                key === 'data' &&
                    this.listSectionData()
            )
        });

        return (
            <section>
                <div className="resume__subheader">
                    <h3 className="sticker">
                        {sectionTitle}
                    </h3>
                </div>

                <div className={sectionClass}>
                    {sectionList}
                </div>
            </section>
        );
    }
}

export default ResumeSections;
