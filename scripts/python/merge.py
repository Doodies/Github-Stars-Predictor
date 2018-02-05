import pandas as pd
import os
import sys

merge_file_name = sys.argv[1]
if '.csv' not in merge_file_name:
	merge_file_name += '.csv' 

path = os.getcwd() + "/"
csv_files = []
files = os.listdir(path)
for file in files:
	if os.path.splitext(path + file)[1] == '.csv':
		csv_files.append(file)

print '-----------------------  total files : ' + str(len(csv_files))
df_dict = {}
total_files = len(csv_files)
for index in range(total_files):
	df_dict["df"+str(index)] = pd.read_csv(path + csv_files[index])

temp = pd.DataFrame()
for i in range(total_files):
	temp  = temp.append(df_dict["df"+str(i)])
	print(csv_files[i] + "   shape:" + str(df_dict["df"+str(i)].shape))

print("------------------\n")
print("final_shape :"+str(temp.shape))
temp.to_csv(merge_file_name, index = False)
	