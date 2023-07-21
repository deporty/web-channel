# from firebase_admin import db, credentials, initialize_app


# cred_obj = credentials.Certificate('credentials.json')
# default_app = initialize_app(cred_object, {'databaseURL':databaseURL})


# ref = db.reference("/")


import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred)

db = firestore.client()




def get_all_summary_teams():
    '''
        Let us to get all registered teams inside Deporty
    '''

    teams_ref = db.collection(u'teams')
    docs = teams_ref.stream()
    response = {}
    for doc in docs:
        response[doc.id] = doc.to_dict()
    return response

def search_team_by_name(teams, name):
    for id in teams:
        team = teams[id]
        if(team['name'] == name):
            return {'id': id, 'data': team}


def update_id_into_teams(teams):
    tournaments_ref = db.collection(u'tournaments')
    tournaments_docs = tournaments_ref.stream()
    for tournament in tournaments_docs:
        fixture_stages_ref = db.collection(u'tournaments/'+tournament.id+'/fixture-stages')

        # fixture_stages_doc = db.collection(u'tournaments/'+tournament.id+'/fixture-stages').document(u'aturing')

        fixture_stages_docs = fixture_stages_ref.stream()

        for fixture_stage_doc in fixture_stages_docs:

            data = fixture_stage_doc.to_dict()

            groups = data['groups']
            index = 0
            for group in groups:
                matches = group['matches']

                for match in matches:

                    team_a_name = match['team-a']['name']
                    team_a_id =  match['team-a']['id'] if 'id' in match['team-a'] else '' 

                    team_b_name = match['team-b']['name']
                    team_b_id =  match['team-b']['id'] if 'id' in match['team-b'] else '' 


                    if(team_a_id == ''):
                        team_a_data = search_team_by_name(teams, team_a_name)
                        team_a = team_a_data['data']
                        match['team-a'] = {
                            'name': team_a['name'],
                            'id': team_a_data['id'],
                            'shield': team_a['shield'],
                        }
                    if(team_b_id == ''):
                        team_b_data = search_team_by_name(teams, team_b_name)
                        if(team_b_data == None):
                            print(team_b_data)
                            print(team_b_name)
                            print()
                        team_b = team_b_data['data']
                        match['team-b'] = {
                            'name': team_b['name'],
                            'id': team_b_data['id'],
                            'shield': team_b['shield'],
                        }
                    print(match)
                index +=1
            # with open('data.json', 'w') as f:
            #     f.write(json.dumps(data, indent=4))





            db.collection(u'tournaments/'+tournament.id+'/fixture-stages').document(fixture_stage_doc.id).set(data)


all_teams = get_all_summary_teams()

with open('all_teams.json', 'w') as t:
    t.write(json.dumps(all_teams, indent=4))
update_id_into_teams(all_teams)










