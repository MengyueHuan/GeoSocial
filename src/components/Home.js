import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import { AroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

export class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        error: '',
        isLoadingPosts: false,
        posts: [],
        topic: 'around',
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({ isLoadingGeoLocation: true, error: '' });
            // const { latitude, longitude } = position.coords;
            const latitude = 37.3382;
            const longitude = 121.8863;
            localStorage.setItem(POS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
            this.setState({ isLoadingGeoLocation: false });
            this.loadNearbyPosts();
            // navigator.geolocation.getCurrentPosition(
            //     this.onSuccessLoadGeoLocation,
            //     this.onFailedLoadGeoLocation,
            //     GEO_OPTIONS);
        } else {
            this.setState({ error: 'Geolocation is not supported.'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
        this.setState({ isLoadingGeoLocation: false });
        this.loadNearbyPosts();
    }

    onFailedLoadGeoLocation = () => {
        this.setState({ isLoadingGeoLocation: false, error: 'Failed to load geolocation.' });
    }

    loadNearbyPosts = (center, radius) => {
        const { lat, lon } = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 200;
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({ isLoadingPosts: true, error: '' });
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                // console.log(response.json())
                return response.json();
            }
            throw new Error('Failed to load posts.');
        }).then((data) => {
            console.log(data);
            this.setState({ isLoadingPosts: false, posts: data ? data : [] });
        }).catch((e) => {
            console.log(e.message);
            this.setState({ isLoadingPosts: false, error: e.message });
        });
    }

    getPanelContent = (type) => {
        const { error, isLoadingGeoLocation, isLoadingPosts, posts } = this.state;
        if (error) {
            return <div>{error}</div>
        } else if(isLoadingGeoLocation) {
            return <Spin tip="Loading geo location..."/>
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..." />
        } else if (posts.length > 0) {
            return type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return 'No nearby posts.';
        }
    }

    getVideoPosts = () => {
        return (
            <Row gutter={32}>
                {this.state.posts.filter((post) => post.type === 'video').map((post) => {
                    return (
                        <Col span={6} key={post.url}>
                            <video src={post.url} controls className="video-block"/>
                            <p>{post.user}: {post.message}</p>
                        </Col>
                    );
                })}
            </Row>
        );
    }

    getImagePosts = () => {
        const images = this.state.posts
            // .filter((post) => post.type === 'image')
            .map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                }
            });

        return (<Gallery images={images}/>);
    }

    onTopicChange = (e) => {
        const topic = e.target.value;
        this.setState({ topic });
        if (topic === 'around') {
            this.loadNearbyPosts();
        } else {
            this.loadFacesAroundTheWorld();
        }
    }

    loadFacesAroundTheWorld = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({ isLoadingPosts: true, error: '' });
        fetch(`${API_ROOT}/cluster?term=face`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
            .then((data) => {
                console.log(data);
                this.setState({ isLoadingPosts: false, posts: data ? data : [] });
            })
            .catch((e) => {
                console.log(e);
                this.setState({ isLoadingPosts: false, error: 'Loading face images failed.'});
            });
    }

    render() {
        console.log("123123")
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <div className="home">
                <RadioGroup onChange={this.onTopicChange} value={this.state.topic} className="topic-radio-group">
                    <Radio value="around">Posts Around Me</Radio>
                    {/*<Radio value="face">Faces Around The World</Radio>*/}
                </RadioGroup>
                <Tabs tabBarExtraContent={operations} className="main-tabs">
                    <TabPane tab="Image Posts" key="1">
                        {this.getPanelContent('image')}
                    </TabPane>
                    {/*<TabPane tab="Video Posts" key="2">*/}
                    {/*    {this.getPanelContent('video')}*/}
                    {/*</TabPane>*/}
                    <TabPane tab="Map" key="3">
                        <AroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `800px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearbyPosts={this.loadNearbyPosts}
                            loadFacesAroundTheWorld={this.loadFacesAroundTheWorld}
                            topic={this.state.topic}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
