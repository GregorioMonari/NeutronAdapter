
D86 <- function(r, bd, VWC, SHPv) {
  return(1/bd*(8.321+0.14249*(0.96655+exp(-0.01*r))*(20+VWC+SHPv)/(0.0429+VWC+SHPv)))
}


invf_Desilets <- function(N,gSM,SHP) {
  
  # parameter Desilets equation
  a0 = 0.0808
  a1 = 0.372
  a2 = 0.115
  
  N0 = N/(a0 / ((gSM + SHP) + a2) + a1)
  
  return(N0)
  
}

# fun_CRNS <- function(Nc,N0,BWE,mBWE,bd) {
f_Desilets <- function(Nc,N0,SHP,bd) {
    
  # -----------------------------------------------------
  # parameter Desilets equation
  a0 = 0.0808
  a1 = 0.372
  a2 = 0.115
  
  # # -----------------------------------------------------
  # # correction of N0 based on BWE
  # N0.cBWE = mBWE * BWE + N0
  
  # -----------------------------------------------------
  # calculate volumetric water content based on Desilet eq.
  vSM.wt = ((a0/(Nc/N0-a1)-a2)-(SHP))*bd

  return(vSM.wt)
  
}