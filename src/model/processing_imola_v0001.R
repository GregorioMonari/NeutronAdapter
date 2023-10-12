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
pacman::p_load(dplyr,
               plotly,
               xts,
               ggplot2,
               scales,
               lubridate,
               hydroGOF,
               cowplot,
               signal)

#install.packages("readr")
library(readr)


# -------------------------
# 0. CONNECT WITH JS
args <- commandArgs(trailingOnly = TRUE)
print(args)
baseFilePath <- args

inputFileJung <- paste(baseFilePath,".in1.csv",sep="")
inputFileFinapp <- paste(baseFilePath,".in2.csv",sep="")
outputFile <- paste(baseFilePath,".out.csv",sep="")

# ------------------------------------------------------------------
# 1. load data and check

# -------------------------------
# download incoming neutron fluxes (JUNG station)
T_ini    <- as.Date("2023-03-15")
T_end    <- Sys.Date()
T_ini_d  <- format(T_ini,"%d")
T_ini_m  <- format(T_ini,"%m")
T_ini_y  <- format(T_ini,"%Y")
T_end_d  <- format(T_end,"%d")
T_end_m  <- format(T_end,"%m")
T_end_y  <- format(T_end,"%Y")

# jung_string <- paste("http://nest.nmdb.eu/draw_graph.php?formchk=1&stations[]=JUNG&tabchoice=revori&dtype=corr_for_efficiency&tresolution=60&yunits=0&date_choice=bydate&start_day=",T_ini_d,"&start_month=",T_ini_m,"&start_year=",T_ini_y,"&start_hour=0&start_min=0&end_day=",T_end_d,"&end_month=",T_end_m,"&end_year=",T_end_y,"&end_hour=23&end_min=59&output=ascii",sep = "")

#print(jung_string)

#------<DA QUI INIZIA IL MODELLO>-------------------------------------------------------------------------------------
print(paste("Reading jung data from file:",inputFileJung))
jung <- read.csv(file=inputFileJung,skip=201,sep=";",header = F)
colnames(jung) = c("Date","N_jung")
jung$Date = as.POSIXct(jung$Date, format =" %Y-%m-%d %H:%M:%S")
jung  <- na.omit(jung)
jung  <- xts(jung[2],order.by = jung$Date)

#rm(T_end_d,T_end_m,T_end_y,
#   T_ini,T_ini_d,T_ini_m,T_ini_y,
#   jung_string)

# quality check 
#plot_01 <- ggplot(jung)+
#  geom_line(aes(x = Index, y = N_jung))+
#  labs(x="")

# -------------------------------
# download CRNS data
# select sensor

# FINAPP headers and ID
FINAPP_headers <- c("Datetime","neutrons","muons","gamma","integration_time(s)",
                    "V_in(Volt)","temperature_in(?C)","temperature_ext(?C)","ur(%)","pressure(hPa)")
id <- read.csv(file = "id_sensor_imola.csv", sep=",")

# -------------------------------
# select sensor
i <- 1
id_finapp_detector <- 1
id_file <- id$id_file[i]
id_finapp <- id$id_finapp[i]
N0  <- id$N0[i]
SHP <- id$SHP[i]
bd  <- id$bd[i]

# -------------------------------
#id_name <- paste("https://www.finapptech.com/finapp/api/getCSV_id.php?ID=",id_finapp,"=&D=",id_finapp_detector,sep = "")
#db <- read.table(id_name,header=F, sep = ";")

# CONTROLLA PERCHE' HO MODIFICATO 
print(paste("Reading Finapp data from file:",inputFileFinapp))
db <- read.csv(file=inputFileFinapp,sep=";",header = F)
colnames(db) <- FINAPP_headers
db$Datetime <- as.POSIXct(db$Datetime,
                          format ="%Y-%m-%d %H:%M:%S") 
db <- na.omit(db)
db <- xts(db[,-1],order.by = db$Datetime) # needed to convert db in an "xts" object

rm(id,FINAPP_headers,i, id_finapp, id_name, id_finapp_detector)

# quality check
plot_02 <- ggplot(db)+
  geom_line(aes(x = Index, y = neutrons))+
  labs(x="")
#ggplotly(plot_02)

# range between mean +- 5sd
# GB: to improve based on derivative
upper_limit <- mean(db$neutrons) + sd(db$neutrons)*5
lower_limit <- mean(db$neutrons) - sd(db$neutrons)*5

db$neutrons[db$neutrons>upper_limit] <- NA
db$neutrons[db$neutrons<lower_limit] <- NA
db <- na.omit(db)
#print(db)

plot_03 <- ggplot(db)+
  geom_line(aes(x = Index, y = neutrons))+
  labs(x="")

ggplotly(plot_02)

rm(lower_limit,upper_limit)

# -------------------------------------------------------------
# 2. process data

# -----------------
# combine in unique object
db$N_jung <- jung$N_jung
#print(db)
rm(jung)
db <- na.omit(db)
#print(db)

# -----------------
# incoming correction fi (JUNG station)
db$fi = (mean(db$N_jung)/db$N_jung)

#--------------------
# pressure correction fp
# GB: to double check standard lambda value

plot_04 <- ggplot(db)+
  geom_line(aes(x = Index, y = pressure.hPa.))
ggplotly(plot_04)

lambda = 1/0.0076 #see Schron et al. 2018
# reference pressure to be defined in case of a network
ref_p <- mean(db$pressure.hPa.,na.rm=T)
db$fp <- exp((db$pressure.hPa. - ref_p)/lambda)

plot_05  <- ggplot(db)+
  geom_line(aes(Index,fp),col=1)+
  geom_line(aes(Index,fi),col=2)+
  ylim(0.8,1.2)

ggplotly(plot_05)

# correct neutrons
db$Nc <- db$neutrons * db$fp * db$fi

plot_06 <- ggplot(db)+
  geom_line(aes(x = Index, y = neutrons),col=1)+
  geom_line(aes(x = Index, y = Nc),col=2)
  # ylim(600,1300)

ggplotly(plot_06)

# Apply a Savitzky-Golay smoothing filter
win_SGF  <-  51
db$Nc_SGF <-  sgolayfilt(db$Nc, n = win_SGF)

plot_07 <- ggplot(db)+
  geom_line(aes(x = Index, y = Nc),col=1)+
  geom_line(aes(x = Index, y = Nc_SGF),col=2,size=1.1)
plot_07

# calibration Desilet equation (conversione per l'umidità)
db$SM <-  f_Desilets(db$Nc_SGF,N0,SHP,bd)

# -------------------------------------------------------------
# 3. visualize data

# select period to visualize
start.end <- c(as.POSIXct("2023-03-24 12:00"), 
               as.POSIXct("2023-09-14 12:00"))

plot_08 <- ggplot(db)+
  geom_line(aes(x = Index, y = SM))+
  ylim(0.05,0.55)+
  scale_x_datetime(limits = start.end,
                   date_breaks="10 day", 
                   minor_breaks=NULL, 
                   date_labels="%d/%m/%y")+
  labs(x="",
       y="Soil moisture",
       title = id_file)

plot_08
# ggplotly(plot_08)

# -------------------------------------------------------------
# 4. save data and plot
#csv_filename <- paste("Data/imola_", T_end, ".csv", sep = "")
#write_csv(db, path = csv_filename, append= TRUE, col_names = TRUE)

# Convert xts object to a data frame
db_df <- as.data.frame(db)

# Specify the CSV file path
#csv_filename <- paste("Data/imola_", T_end, ".csv", sep = "")

# Write the data frame to a CSV file
write_csv(db_df, path = outputFile, append = TRUE, col_names = TRUE)

#ggsave(paste("Figure/",id_file,"_",T_end,".png",sep=""), plot_08,
#       width = 4, height = 3)
