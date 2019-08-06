import React, { Component } from 'react';

import '../assets/css/cereza.css';

import Contact from '../components/general/contact';
import Footer from '../components/general/footer';
import ResumeSections from '../components/resume/resume-sections';

import profile from '../content/images/hansl-pasfoto-200.jpg';

class CV extends React.Component {

    constructor() {
        super();

        this.state = {
            resume: {
                general: {},
                skills: {},
                projects: {},
                about: {},
                work_experiences: {}
            }
        }
    }

    componentDidMount = () => {
        window.scrollTo(0, 0);
        this.getResumeData();
    }

    getResumeData = async (season) => {
        try {
            let response = await fetch('http://www.cereza.nl/api/cereza/getResumeData.php', {
                method: 'GET',
                headers: new Headers({

                }),
            });
            let responseJson = await response.json();
            if(responseJson !== null) {
                console.log('SbC resume data:', responseJson)
                this.setState({
                    resume: responseJson
                });
            } else {
                console.log('SbC no resume data:')
            }
        } catch (error) {
            console.log('SbC fetch error: ', error.message);
        }
    }
    
    render() {
        const listSections = Object.keys(this.state.resume).map((key) => {
            return (
                <div className="card clean resume">
                    <ResumeSections data={this.state.resume[key]} section={key} />
                </div>
            )
        });
        return (
            <div className="app">
                {/* <div className="card__profile">
                    <div className="profile__picture">
                        <img src={profile} className="profile-picture" alt="profile" />
                    </div>
                </div> */}

                <div className="card__header">
                    <h2>Resume</h2>
                </div>

                {listSections}

                <div className="card clean focus1 contact">
                    <Contact />
                </div>

                <Footer />
            </div>
        );
    }
}

export default CV;
