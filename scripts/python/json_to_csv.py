import json
from pprint import pprint
import pandas as pd
import sys
import re
import os

reload(sys)  
sys.setdefaultencoding('utf-8')

user_values = []
org_values = []
user_col = []
org_col = []

isEmptyUser = True
isEmptyOrg = True
def handle_gist(gists):
	gists = gists['edges']
	gistStars = 0
	gistComments = 0
	for gist in gists:
		gistStars += gist['node']['stargazers']['totalCount']
		gistComments += gist['node']['comments']['totalCount']
	return gistStars, gistComments

def handle_pr(pr):
	pr = pr['edges']
	prComments = 0
	prCommits = 0
	for p in pr:
		prComments += p['node']['comments']['totalCount']
		prCommits += p['node']['commits']['totalCount']
			# print(str(pr['node']['comments']['totalCount']))
	return prCommits,  prComments

def handle_issues(issues):
	issues = issues['edges']
	issuesComments  = 0
	issuesParticipants  = 0
	for issue in issues:
		issuesComments += issue['node']['comments']['totalCount']
		issuesParticipants += issue['node']['participants']['totalCount']
	return issuesParticipants, issuesComments

def handle_readme(string):
	links_count = len(re.findall(r'(https?://[^\s]+)', string))
	word_count = len(re.findall(r'\w+', string))
	char_count = len(string)
	return char_count, word_count, links_count

def handle_objects(obj):
	global isEmptyUser
	global isEmptyOrg
	global user_values
	global org_values
	global user_col
	global org_col

	repo = obj['repository']	
	data_dict = {}
	# print repo
	data_dict['reponame'] = str(repo['name'])
	data_dict['createdAt'] = repo['createdAt']
	data_dict['pushedAt'] = repo['pushedAt']
	data_dict['updatedAt'] = repo['updatedAt']
	data_dict['description'] = repo['description']
	data_dict['diskUsage'] = repo['diskUsage']
	data_dict['forkCount'] = repo['forkCount']
	data_dict['hasWikiEnabled'] = repo['hasWikiEnabled']
	data_dict['isArchived'] = repo['isArchived']
	data_dict['issuesClosed'] = repo['issuesClosed']['totalCount']
	data_dict['issuesOpen'] = repo['issuesOpen']['totalCount']
	data_dict['license'] = repo['license'] if repo['license'] is not None else ""
	data_dict['primaryLanguage'] = repo['primaryLanguage']['name'] if repo['primaryLanguage'] is not None else ""
	data_dict['prClosed'] = repo['pullRequestsClosed']['totalCount']
	data_dict['prMerged'] = repo['pullRequestsMerged']['totalCount']
	data_dict['prOpen'] = repo['pullRequestsOpen']['totalCount']
	data_dict['releases'] = repo['releases']['totalCount']
	data_dict['stars'] = repo['stars']['totalCount']
	data_dict['subscribersCount'] = repo['subscribersCount']['totalCount']
	data_dict['tags'] = repo['tags']['totalCount']
	data_dict['branches'] = repo['numBranches']['totalCount']
	data_dict['commits'] = repo['numCommits']['target']['history']['totalCount'] if repo['numCommits'] is not None else ""
	data_dict['prMergedCommits'], data_dict['prMergedComments'] = handle_pr(repo['PRMergedCommentsCommitsCount']) 
	data_dict['prOpenCommits'], data_dict['prOpenCommits'] = handle_pr(repo['PROpenCommentsCommitsCount']) 
	data_dict['prClosedCommits'], data_dict['prClosedComments'] = handle_pr(repo['PRClosedCommentsCommitsCount'])
	data_dict['iOpenParticipants'], data_dict['iOpenComments'] = handle_issues(repo['iOpenCommentsParticipantsCount'])
	data_dict['iClosedParticipants'], data_dict['iClosedComments'] = handle_issues(repo['iClosedCommentsParticipantsCount'])
	data_dict['type'] = repo['type']

	#  Handle the readme file
	data_dict["readmeCharCount"] = 0
	data_dict["readmeWordCount"] = 0
	data_dict["readmeLinkCount"] = 0
	data_dict["readmeSize"] = 0
	if repo['readme'] != None:
		data_dict['readmeSize'] = repo['readme']["byteSize"]
		data_dict['readmeCharCount'], data_dict['readmeWordCount'], data_dict['readmeLinkCount'] = handle_readme(repo['readme']['text'])



	# if the repo from the user
	if obj.keys()[0] == 'user':
		user = obj['user']
		# pprint(user)
		data_dict['login'] = user['login']
		data_dict['followers'] = user["followers"]["totalCount"]
		data_dict['following'] = user["following"]["totalCount"]
		data_dict['gists'] = user['gists']['totalCount']
		data_dict['gistStar'], data_dict['gistComments'] = handle_gist(user['gists'])
		data_dict['location'] = user['location']
		data_dict['organizations'] = user["organizations"]["totalCount"]
		data_dict['repositories'] = user["repositories"]["totalCount"]
		data_dict['websiteUrl'] = user["websiteUrl"]

		if isEmptyUser:
			user_col = list(data_dict.keys())
			isEmptyUser = False
		user_values.append(list(data_dict.values()))

	# if the repository from the organization
	elif obj.keys()[0] == 'organization':
		org = obj['organization']
		data_dict['login'] = org['login']
		data_dict['websiteUrl'] =  org['websiteUrl']
		data_dict['members'] =  org['members']["totalCount"]
		data_dict['location'] =  org['location']
		data_dict['repositories'] = org["repositories"]["totalCount"]

		if isEmptyOrg:
			org_col = list(data_dict.keys())
			isEmptyOrg = False
		org_values.append(list(data_dict.values()))


def save_files(file_name):
	file_name += '.csv' 
	global user_col
	global org_col
	global user_values
	global org_values
	df_user = pd.DataFrame(data = user_values, columns = user_col)
	df_org = pd.DataFrame(data = org_values, columns = org_col)
	# print("\nsaving..... user dataframe")
	# df_user.to_csv('user.csv', index = False)
	# print("\nsaving..... org dataframe")
	# df_org.to_csv('org.csv', index = False)

	merge = df_user.append(df_org)
	print("\nsaving..... + " + file_name + " dataframe")
	merge.to_csv(file_name, index = False)

	# 	# user data
	# 	# pprint(repo)

		

	# 	# if isEmpty:
	# 		# df = pd.DataFrame(columns = list(data_dict.keys()))
	# 		# isEmpty = False
	# 	# append the row to the pandas dataframe
	# 	df.loc[df.index.max() + 1, list(data_dict.keys())] = list(data_dict.values())
		# pprint(data_dict)


# count = 0
# for i in data:
# 	if i['repository']['object'] == None:
# 		count+=1
# print count

# print(len(data_dict))
# print(createdAt,pushedAt,updatedAt,diskUsage,forkCount,hasWikiEnabled,isArchived,issuesClosed,issuesOpen,license,primaryLanguage,prClosed,prMerged,prOpen,releases,stars,subscribersCount,tags)
# handle_objects(data[2])

# print(data)


# for i, j in zip(data[0]["user"].keys(), data[4]["organization"].keys()):
# 	print "{0: <32} {1: <32}".format(i, j)


# print data[0]




path = os.getcwd() + "/"
json_files = []
files = os.listdir(path)
for file in files:
	if os.path.splitext(path + file)[1] == '.json':
		json_files.append(file)

print '----------------------------  total files :  ' + str(len(json_files))
for file in json_files:
	user_values = []
	org_values = []
	user_col = []
	org_col = []

	isEmptyUser = True
	isEmptyOrg = True
	data = json.load(open(path + file))
	count = 0
	print '----------------- ' + str(file) + ' -----------------------'
	for i in data:
		if count % 1000 == 0 and count !=0:
			print 'rows :' + str(count)
		handle_objects(i)
		count+=1
	save_files(file[:-5])


# for i in data[0]['repository'].keys():
# 	print i + "   " + str(data[0]['repository'][i]) 
# print(data[2]["organization"].keys())

