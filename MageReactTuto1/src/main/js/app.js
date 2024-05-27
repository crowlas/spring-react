'use strict';

import MageList from './components/mageList';
import AppEquipement from './components/equipementList';
import {CreateDialog} from './components/dialog';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
var stompClient = require('./websocket-listener')
const client = require('./connection/client');

const follow = require('./connection/follow'); // function to hop multiple links by "rel"

function followApi(relArray) {
	return follow(client, '/api', relArray);
}

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {mages: [], mageName: "", schema: {}, attributes: [], page: 1, pageSize: 2, links: {}, logs: ""}; // variables gloabal
		// ecouteurs
		this.updatePageSize = this.updatePageSize.bind(this);
		this.updateMageName = this.updateMageName.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
		this.messageWebsocket = this.messageWebsocket.bind(this);
		this.initMessageWebsocket = this.initMessageWebsocket.bind(this);
		this.loadAttributeFromServer = this.loadAttributeFromServer.bind(this);
		
	}
	
	updateMageName(mageName){
		if (mageName !== this.state.mageName) {
			this.loadFromServer(this.state.pageSize, mageName);
		}	
	}
	
	loadAttributeFromServer(rel) {
		alert("cc1="+rel)
		client({method: 'GET', path: '/api/profile/'+rel}).done(schema => {
			alert("schema="+JSON.stringify(schema))
			this.setState({schema: schema.entity});
		});
	}
	
	loadFromServer(pageSize, mageName) {
		followApi([{rel: 'magesSearch', params: {size: pageSize, name: mageName}}]
		).then(mageCollection => {
			return mageCollection.entity._embedded.mages.map(mage =>
					client({
						method: 'GET',
						path: mage._links.self.href
					})
			);
		}).then(magePromises => {
			return when.all(magePromises);
		}).done(mages => {
			this.setState({
				mages: mages,
				attributes: Object.keys(this.state.schema.properties),
				pageSize: pageSize,
				mageName:mageName,
				links: this.links
			});
		});
		this.initMessageWebsocket();
	}
	
	onUpdate(rel, newRel) {
		client({
			method: 'PUT',
			path: rel.entity._links.self.href,
			entity: newRel,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': rel.headers.Etag
			}
		})
		.catch(err => alert(JSON.stringify(err.entity.cause.message)))
		.done(response => {
			this.refreshCurrentPage();
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
					rel.entity._links.self.href + '. Your copy is stale.');
			}
		});
	}
	
	onCreate(newEmployee) {
		followApi(['mages']).then(response => {
			return client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newEmployee,
				headers: {'Content-Type': 'application/json'}
			})
		})
		.then(response => {
			return followApi([{rel: 'magesSearch', params: {'size': this.state.pageSize, 'name': this.state.mageName}}]);
		})
		.catch(err => alert(JSON.stringify(err.entity.errors)))
		.done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
		this.initMessageWebsocket();
	}

	onDelete(rel) {
		client({method: 'DELETE', path: rel.entity._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}	
	
	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(mageCollection => {
			this.links = mageCollection.entity._links;
			this.page = mageCollection.entity.page;

			return mageCollection.entity._embedded.mages.map(mage =>
					client({
						method: 'GET',
						path: mage._links.self.href
					})
			);
		}).then(magePromises => {
			return when.all(magePromises);
		}).done(mages => {
			this.setState({
				mages: mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				page: this.page,
				links: this.links
			});
		});
		this.initMessageWebsocket();
	}
	
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}
	
	componentDidMount() {
		this.loadAttributeFromServer('mages');
		this.loadFromServer(this.state.pageSize);
		stompClient.register([
			{route: '/topic/newMage', callback: this.messageWebsocket},
			{route: '/topic/updateMage', callback: this.messageWebsocket},
			{route: '/topic/deleteMage', callback: this.messageWebsocket}
		]);
	}
	
	initMessageWebsocket(message) {
		document.getElementById("alertMajText").textContent="The page is up to date.";
		document.getElementById("refreshButton").setAttribute('disabled', 'true');
	}
	
	messageWebsocket(message) {
		document.getElementById("alertMajText").textContent="Change detected : ";
		document.getElementById("refreshButton").removeAttribute('disabled');
	}
	
	refreshCurrentPage(message) {
		followApi([{rel: 'magesSearch',
			params: {
				size: this.state.pageSize,
				page: this.state.page.number,
				name : this.state.mageName
			}
		}]).then(mageCollection => {
			this.links = mageCollection.entity._links;
			this.page = mageCollection.entity.page;
	
			return mageCollection.entity._embedded.mages.map(mage => {
				return client({
					method: 'GET',
					path: mage._links.self.href
				})
			});
		}).then(magePromises => {
			return when.all(magePromises);
		}).then(mages => {
			this.setState({
				page: this.state.page,
				mages: mages,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
		this.initMessageWebsocket();
	}

	render() {
		return (
			<div className="App">
		      <header className="App-header">
		        <h1>DEMO Plateform de partage d'articles</h1>
		        <p>
		        	<span>Un projet REACT permettant d'intéragir avec une </span>
		        	<a className="App-link" href="/api"
		          		target="_blank" rel="noopener noreferrer">API</a>.
		        </p>
		      </header>
		      <div className='body'>
				<div id='alertMaj'>
					<span id='alertMajText'></span>
					<button id='refreshButton' onClick={this.refreshCurrentPage}>Refresh the page</button>
				</div>
				<div>
	                <h2>List of articles</h2>
	                <CreateDialog attributes={this.state.attributes.filter(attribute => attribute != "equipements")} onCreate={this.onCreate}/>
					<MageList mages={this.state.mages}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  mageName={this.state.mageName}
							  attributes={this.state.attributes.filter(attribute => attribute != "equipements")}
							  onNavigate={this.onNavigate}
							  onUpdate={this.onUpdate}
							  onDelete={this.onDelete}
							  refreshCurrentPage={this.refreshCurrentPage}
							  updatePageSize={this.updatePageSize}
							  updateMageName={this.updateMageName}
							  />
	            </div>
	            <AppEquipement/>
		      </div>
		    </div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)