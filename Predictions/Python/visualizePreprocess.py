# Visualizing The Dataset
"""

!wget = 'https://raw.githubusercontent.com/Doodies/Github-Stars-Predictor/master/finaldata.csv'

!ls

# Ignore warnings
import warnings
warnings.filterwarnings('ignore')

# Handle table-like data and matrices
import numpy as np
import pandas as pd

# Visualisation
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.pylab as pylab
import seaborn as sns

# Configure visualisations
# %matplotlib inline
color = sns.color_palette()
pd.options.mode.chained_assignment = None
pd.options.display.max_columns = 999
# mpl.style.use( 'ggplot' )
sns.set_style( 'whitegrid' )
pylab.rcParams[ 'figure.figsize' ] = 8,6

data = pd.read_csv('finaldata.csv')

"""## Plotting Scatter plot of Stars Count"""

def plot_feature(df, col):
    plt.scatter(range(df.shape[0]), np.sort(df[col].values))
    plt.xlabel('index', fontsize=12)
    plt.ylabel(col, fontsize=12)
    plt.show()

plot_feature(data, "stars")

len(data[data['stars'] > 20000])

"""## Checking Relationship between Stars and forkCount"""

sns.jointplot(x = "stars", y = "forkCount", data = data)

data[data['prMergedComments'] == 0].shape

newDf = data.select_dtypes(include=[np.number])

newDf.head()

"""## Checking the Percentage of zeroes in all columns"""

cols  = newDf.columns
zero_rows = []
zero_per = []
for i in cols:
  zero_rows.append(newDf[newDf[i] == 0].shape[0])
  zero_per.append(newDf[newDf[i] == 0].shape[0] * 100 / float(data.shape[0]))

df = pd.DataFrame({'col':cols,'numberRows':zero_rows,'zero_per':zero_per})

df.sort_values(['numberRows'], ascending=False)

"""## Plotting Difference Between Numbers of Users and Organization"""

data.type.value_counts()
data.type.value_counts().plot.bar()

"""## Checking Top 20 Primary Languages"""

data.primaryLanguage.value_counts()[:20].plot(kind = 'bar', color = color[1])

data.head(3)

"""## Changing the time to their Hours Representation"""

time_columns = ['createdAt','updatedAt','pushedAt']
for i in time_columns:
  data[i] =  data[i].apply(lambda x : x.replace('T',' ').replace('Z',''))

from datetime import datetime

for i in time_columns:
  data[i] = data[i].apply(lambda x: int(datetime.strptime(x,'%Y-%m-%d %H:%M:%S').strftime('%s')) / (60 * 60))

data.loc[:, time_columns]

data.head(3)

"""## Website Url to Binary Form 1(Yes)/0(No)"""

data['websiteUrl'] = data['websiteUrl'].fillna('')

data['websiteUrl'] = data['websiteUrl'].apply(lambda x : 1 if len(x) > 0 else 0)

data['websiteUrl'].value_counts().plot.bar()

data.head(3)

"""## Description Word and Character Count"""

data['description'] = data['description'].fillna('')

data['desWordCount'] = data['description'].apply(lambda x: len(x.split(' ')))
data['desCharCount'] = data['description'].apply(len)

data.head(3)

"""## hasWikiEnabled to Binary Form"""

print(data['hasWikiEnabled'].value_counts())
data['hasWikiEnabled'].value_counts().plot.bar()

data['hasWikiEnabled'] = data['hasWikiEnabled'].apply(lambda x : 1 if x else 0)

"""## License to OneHotEncoding"""

set(data['license'])

data['license'].value_counts(dropna = False)[:10].plot.bar()

data['license'] = data['license'].fillna('')

license_cols = ['mit_license','nan_license','apache_license','other_license','remain_license']

for i in license_cols:
  if i.startswith('mit'):
    data[i] = data['license'].apply(lambda x: 1 if x == 'MIT License' else 0)
  elif i.startswith('nan'):
    data[i] = data['license'].apply(lambda x: int(len(x) == 0))
  elif i.startswith('apache'):
    data[i] = data['license'].apply(lambda x: 1 if x == 'Apache License 2.0' else 0)
  elif i.startswith('other'):
    data[i] = data['license'].apply(lambda x: 1 if x == 'Other' else 0)

data['remain_license'] = (data[license_cols[:-1]].sum(axis=1) == 0).astype(int)

data.head()

"""## Primary Language to OneHotEncoding"""

data.primaryLanguage.isnull().sum()

data.primaryLanguage.value_counts()[:20].plot.bar()

lang_cols = np.array(data.primaryLanguage.value_counts()[:6].index)

data[lang_cols[0]] = data.primaryLanguage.apply(lambda x : int(x == 'JavaScript'))                  
data[lang_cols[1]] = data.primaryLanguage.apply(lambda x : int(x == 'Python'))                  
data[lang_cols[2]] = data.primaryLanguage.apply(lambda x : int(x == 'Java'))                  
data[lang_cols[3]] = data.primaryLanguage.apply(lambda x : int(x == 'Objective-C'))                  
data[lang_cols[4]] = data.primaryLanguage.apply(lambda x : int(x == 'Ruby'))                  
data[lang_cols[5]] = data.primaryLanguage.apply(lambda x : int(x == 'PHP'))
data['other_language'] = (data[lang_cols].sum(axis=1) == 0).astype(int)

data.head(3)

"""## type to binary form 1(User) / 0(Org)"""

newDf = data

data['type'] = data.type.apply(lambda x : 1 if x == 'user' else 0)

data.members.isnull().sum()

data.type.value_counts()

data.head(3)

"""## Setting nan members , organizations , gists , giststar , gistComments , followers , following to 0"""

data['members'] = data['members'].fillna(0)

data['organizations'] = data['organizations'].fillna(0)
data['gists'] = data['gists'].fillna(0)
data['gistStar'] = data['gistStar'].fillna(0)
data['gistComments'] = data['gistComments'].fillna(0)
data['following'] = data['following'].fillna(0)
data['followers'] = data['followers'].fillna(0)

data.isnull().sum()

"""## Plotting Missing Data"""

def plot_missing_data(df):
    missing_df = df.isnull().sum(axis=0).reset_index()
    missing_df.columns = ['column_name', 'missing_count']
    missing_df = missing_df.loc[missing_df['missing_count']>0]
    missing_df = missing_df.sort_values(by='missing_count')

    ind = np.arange(missing_df.shape[0])
    width = 0.9
    fig, ax = plt.subplots(figsize=(12,9))
    rects = ax.barh(ind, missing_df.missing_count.values, color=color[3])
    ax.set_yticks(ind)
    ax.set_yticklabels(missing_df.column_name.values, rotation='horizontal')
    ax.set_xlabel("Count of missing values")
    ax.set_title("Number of missing values in each column")
    plt.show()

plot_missing_data(data)

"""## removing the null numCommits(of master branch) rows"""

data.commits.isnull().sum()

data = data[data.commits.notnull()]

data.shape

data.commits.isnull().sum()

"""## Removing the null reponame rows"""

print(data.reponame.isnull().sum())
data.shape

data = data[data.reponame.notnull()]

print(data.reponame.isnull().sum())
data.shape

data.head()

data.select_dtypes(include = np.bool)

"""## Dropping Columns"""

data.columns

## Columns to drop
Df = data
col = ['description' , 'isArchived' , 'license' ,'location' , 'login' , 'primaryLanguage' , 'reponame' , 'siteAdmin']
data = data.drop(col , axis = 1)

def count_dtypes(df):
    pd.options.display.max_rows = 65
    dtype_df = df.dtypes.reset_index()
    dtype_df.columns = ["Count", "Column Type"]
    return dtype_df.groupby("Column Type").aggregate('count').reset_index()

count_dtypes(data)

data.head(3)

"""## Saving it as a PreProcessing file"""

data.to_csv('PreprocessData.csv')

!ls

from google.colab import files
files.download('PreprocessData.csv')
