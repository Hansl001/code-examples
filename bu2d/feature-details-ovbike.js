import React, { Component } from 'react'
import { observer } from "mobx-react";
import Moment from 'react-moment';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import classNames from 'classnames';
import i18n from "i18next";

class OpeningStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const classOpenStatus = classNames({
            'proximity__status': true,
            '--closed': !(this.props.availability === true || this.props.availability === 'allday') ? true : false
        });

        return (
            <span className={classOpenStatus}>
                {(this.props.availability === 'allday')
                    ? 'open 24/7'
                    : (this.props.availability === 'noweekend')
                        ? 'closed in weekends'
                        : (this.props.availability)
                            ? <StatusTimes
                                openUntil = {this.props.openUntil}
                              />
                            : 'closed'
                }
            </span>
        );
    }
}

class StatusTimes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                open until {this.props.openUntil}
            </React.Fragment>
        );
    }
}

export default class DetailsOvBike extends Component {
	constructor(props) {
        super(props);
        this.storeUi = this.props.storeUi;

        this.state = {
            activeTitle: '',
            data: this.props.loc
        }

        const d = new Date();
        //SbC:: test data
        //const d = new Date('2018-09-05T10:10+0200');
        //const d = new Date('2019-06-10T00:56+0200');

        this.currDay = d.getDay();
        if (this.currDay !== 0) {
            this.currDayIdx = d.getDay() - 1;
        } else {
            this.currDayIdx = 6;
        }
        this.currTime = moment(d).format('HH:mm');
	}

    async componentDidMount() {
        //this.getDay();
    }

    getDay = (idx) => {
        const d = new Date();
        let currDay = d.getDay();
        if (idx === 'next') {
            currDay = currDay + 1;
        }
        return parseInt(currDay);
    }

    setOutdated = (loc) => {
        let currTime = (new Date).getTime();
        let outdated = ((currTime / 1000) - loc.details.extra.fetchTime) / 3600;
        let isOutdated = (outdated > 2) ? true : false;
        return isOutdated;
    }

    checkOpen = (loc) => {
        let isOpen = {
            open: false,
            openUntil: '00:00'
        };
        const currTime = this.currTime;
        let currDay = this.currDay;
        let currDayIdx = this.currDayIdx;
        let dayIdx;

        if (loc.details.openingHours[0].startTime === "00:00" && loc.details.openingHours[0].endTime === "24:00") {
            //SbC:: 24/7 open
            isOpen = {
                open: "allday",
                openUntil: "allday"
            }
        } else {
            //SbC:: check array opening hours
            if (currDayIdx > loc.details.openingHours.length - 1) {
                //currDay not in array opening hours -> = weekend day
                isOpen = {
                    open: "noweekend",
                    openUntil: "noweekend"
                }
            } else {
                let startingTime = loc.details.openingHours[currDayIdx].startTime;
                let closingTime = loc.details.openingHours[currDayIdx].endTime;

                if (moment(currTime, 'HH:mm').isAfter(moment(startingTime, 'HH:mm'))) {
                    //SbC:: after starting time
                    if (moment(currTime, 'HH:mm').isBefore(moment(closingTime, 'HH:mm')) || loc.details.openingHours[currDayIdx].closesNextDay) {
                        //console.log('SbC after start :: before closing::', this.loc.description)
                        isOpen = {
                            open: true,
                            openUntil: closingTime
                        }
                    } else {
                        //console.log('SbC after start :: after closing::', this.loc.description)
                        isOpen = {
                            open: false
                        }
                    }
                } else {
                    //SbC:: before starting time but could be in opening hours previous day
                    if (currDayIdx === 0 && loc.details.openingHours.length !== 7) {
                        isOpen.open = false;
                    } else {
                        if (currDayIdx === 0) {
                            dayIdx = loc.details.openingHours.length - 1;
                        } else {
                            dayIdx = currDayIdx - 1;
                        }
                        if (loc.details.openingHours[dayIdx].closesNextDay) {
                            closingTime = loc.details.openingHours[dayIdx].endTime;
                            if (moment(currTime, 'HH:mm').isBefore(moment(closingTime, 'HH:mm'))) {
                                //console.log('SbC before start :: open in day before::', this.loc.description)
                                //SbC TODO:: isOpen = 'nighthours'
                                isOpen = {
                                    open: true,
                                    openUntil: closingTime
                                }
                            } else {
                                //console.log('SbC before start :: after end previous day', this.loc.description)
                                isOpen = {
                                    open: false,
                                    openAt: startingTime
                                }
                            }
                        } else {
                            //console.log('SbC before start :: no previous day', this.loc.description)
                            isOpen = {
                                open: false,
                                openAt: startingTime
                            }
                        }
                    }
                }
            }
        }

        return isOpen;
    }
    
    render() {
        i18n.changeLanguage(this.props.storeUi.app_interface.lang);
        let loc = this.props.loc;

        let isAvailable = {
            open: false,
            openUntil: '00:00'
        };

        loc.details && loc.details.openingHours && (
           isAvailable = this.checkOpen(loc)
        )
        
        const classAvailability = (parseInt(loc.details.extra.rentalBikes) === 0 || !isAvailable.open || isAvailable.open === 'noweekend')
            ? '--unavailable'
            : '--available';

        const classOutdated = classNames({
            'identifier__update-time': true,
            '--outdated': this.setOutdated(loc)
        });

	    return (
	        <div className={"container-identifier__content " + classAvailability}>
                <div className="identifier__header">
                    <h2 className="identifier__title">
                        {loc.details.description ? loc.details.description : loc.details.name}
                    </h2>
                    <OpeningStatus
                        availability = {isAvailable.open}
                        openUntil = {isAvailable.openUntil}
                    />
                    <span className="identifier__subtitle">
                        {loc.details.extra.rentalBikes 
                            ?   <span>{loc.details.extra.rentalBikes} {i18n.t("helper.available")}</span>
                            :   <span>{i18n.t("helper.availability_unknown")}</span>
                        }
                    </span>
                </div>

                <div className="identifier__footer">
                    <span className={classOutdated}>{i18n.t("helper.last_update")}<br/>
                        <TimeAgo
                            date={loc.details.extra.fetchTime * 1000}
                            minPeriod='60'
                        />
                    </span>
                </div>
	        </div>
	    )
    }
}

DetailsOvBike = observer(DetailsOvBike)
