print("Argomenti a riga di comando")
args <- commandArgs(trailingOnly = TRUE)
print(args)

print(paste(args,".in1.csv",sep=""))
print(paste(args,".in2.csv",sep=""))
print(paste(args,".out.csv",sep=""))