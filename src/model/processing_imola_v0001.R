# -------------------------------------------------------------
# Script to process CRNS data
# University of Bologna (Italy)
# G.Baroni, S.Gianessi...
# last updated
# --------------
# May 2023
# --------------
# script for Imola
# -------------------------------------------------------------

# -------------------------------------------------------------
# 0. clean and load libraries
print("### MODEL STARTING ###")
rm(list = ls())

source("fun_CRNS.R")

if(!require(pacman)) install.packages("pacman")
pacman::p_load(dplyr,plotly,xts,ggplot2,scales,lubridate,hydroGOF,cowplot,signal)

#install.packages("readr")
library(readr)

# 0. CONNECT WITH JS
args <- commandArgs(trailingOnly = TRUE)
print(args)
baseFilePath <- args
inputFileJung <- paste(baseFilePath,".in1.csv",sep="")
inputFileFinapp <- paste(baseFilePath,".in2.csv",sep="")
outputFile <- paste(baseFilePath,".out.csv",sep="")

#------<START MODEL>-------------------------------------------------------------------------------------
print(paste("Reading jung data from file:",inputFileJung))
jung <- read.csv(file=inputFileJung,skip=201,sep=";",header = F)
colnames(jung) = c("Date","N_jung") 
jung$Date = as.POSIXct(jung$Date, format =" %Y-%m-%d %H:%M:%S")
jung  <- na.omit(jung)
jung  <- xts(jung[2],order.by = jung$Date)

# FINAPP headers and ID
FINAPP_headers <- c("Datetime","neutrons","muons","gamma","integration_time(s)","V_in(Volt)",
                        "temperature_in(?C)","temperature_ext(?C)","ur(%)","pressure(hPa)")
id <- read.csv(file = "id_sensor_imola.csv", sep=",")

# select sensor
i <- 1
id_finapp_detector <- 1
id_file <- id$id_file[i]
id_finapp <- id$id_finapp[i]
N0  <- id$N0[i]
SHP <- id$SHP[i]
bd  <- id$bd[i]

print(paste("Reading Finapp data from file:",inputFileFinapp))
db <- read.csv(file=inputFileFinapp,sep=";",header = F)
colnames(db) <- FINAPP_headers
db$Datetime <- as.POSIXct(db$Datetime,format ="%Y-%m-%d %H:%M:%S") 
db <- na.omit(db)
db <- xts(db[,-1],order.by = db$Datetime) 
rm(id,FINAPP_headers,i, id_finapp, id_name, id_finapp_detector)

# range between mean +- 5sd
upper_limit <- mean(db$neutrons) + sd(db$neutrons)*5
lower_limit <- mean(db$neutrons) - sd(db$neutrons)*5

db$neutrons[db$neutrons>upper_limit] <- NA
db$neutrons[db$neutrons<lower_limit] <- NA
db <- na.omit(db)

rm(lower_limit,upper_limit)

# combine in unique object
db$N_jung <- jung$N_jung
rm(jung)
db <- na.omit(db)

# incoming correction fi (JUNG station)
db$fi = (mean(db$N_jung)/db$N_jung)

lambda = 1/0.0076 #see Schron et al. 2018

# reference pressure to be defined in case of a network
ref_p <- mean(db$pressure.hPa.,na.rm=T)
db$fp <- exp((db$pressure.hPa. - ref_p)/lambda)

# correct neutrons
db$Nc <- db$neutrons * db$fp * db$fi

# Apply a Savitzky-Golay smoothing filter
win_SGF  <-  51
db$Nc_SGF <-  sgolayfilt(db$Nc, n = win_SGF)

# calibration Desilet equation
db$SM <-  f_Desilets(db$Nc_SGF,N0,SHP,bd)

# 3. visualize data
# select period to visualize
start.end <- c(as.POSIXct("2023-03-24 12:00"), 
               as.POSIXct("2023-09-14 12:00"))

# Convert xts object to a data frame
db_df <- as.data.frame(db)

# Specify the CSV file path
db_with_datetime <- data.frame(
  DateTime = index(db),  # 'index' retrieves the date-time from 'db'
  db  # Include all other columns from 'db'
)

# Write the data frame to a CSV file
write_csv(db_with_datetime, path = outputFile, append = TRUE, col_names = TRUE)
