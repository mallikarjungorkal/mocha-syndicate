import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

# ---------------------------------------------------------
# PAGE SETUP & PREMIUM MOCHATRADE DARK-COFFEE THEME
# ---------------------------------------------------------
st.set_page_config(
    page_title="TradeX Labs | MochaTrade Macro Simulator",
    page_icon="☕",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for dark slate, mocha espresso gradients, luxury badges, and colored buttons
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .stApp {
        background-color: #070a11;
        color: #e4e7eb;
    }
    
    /* SIDEBAR CONTAINER */
    section[data-testid="stSidebar"] {
        background-color: #0e1424 !important;
        border-right: 1px solid #1e293b;
    }

    section[data-testid="stSidebar"] h1, 
    section[data-testid="stSidebar"] h2, 
    section[data-testid="stSidebar"] h3 {
        color: #67e5ee !important;
        font-weight: 700 !important;
        letter-spacing: -0.3px;
    }

    section[data-testid="stSidebar"] .stCaption, 
    section[data-testid="stSidebar"] p {
        color: #94a3b8 !important;
    }

    section[data-testid="stSidebar"] div[data-testid="stExpander"] {
        background: #151821 !important;
        border: 1px solid #1e293b !important;
        border-radius: 12px !important;
        margin-bottom: 12px !important;
    }

    section[data-testid="stSidebar"] div[data-testid="stExpander"] summary {
        color: #f8fafc !important;
        font-weight: 600 !important;
    }

    section[data-testid="stSidebar"] div[data-testid="stExpander"] summary:hover {
        color: #67e5ee !important;
    }

    section[data-testid="stSidebar"] label p {
        color: #cbd5e1 !important;
        font-weight: 500 !important;
    }

    section[data-testid="stSidebar"] div[data-testid="stRadio"] > div {
        background: #070a11;
        padding: 8px;
        border-radius: 12px;
        border: 1px solid #1e293b;
    }
    section[data-testid="stSidebar"] div[data-testid="stRadio"] label p {
        color: #e2e8f0 !important;
    }

    /* MAIN APP STYLING */
    .lab-header {
        background: linear-gradient(135deg, #0e1424 0%, #151d33 50%, #070a11 100%);
        border: 1px solid #1e293b;
        border-radius: 16px;
        padding: 24px 32px;
        margin-bottom: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    
    .lab-title {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(90deg, #67e5ee, #ff914d, #48d297);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 4px;
    }
    
    .lab-subtitle {
        color: #94a3b8;
        font-size: 13px;
    }
    
    .crypto-card {
        background: #0e1424;
        border: 1px solid #1e293b;
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 16px;
    }
    
    .metric-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 26px;
        font-weight: 600;
        color: #f8fafc;
    }
    
    .metric-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #7c879d;
        margin-bottom: 4px;
    }
    
    .trust-pill {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        background: rgba(103, 229, 238, 0.15);
        color: #67e5ee;
        border: 1px solid rgba(103, 229, 238, 0.3);
    }
    
    .leader-box {
        background: #0e1424;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .leader-box:hover {
        border-color: #67e5ee;
        background: #141c30;
    }

    div.stButton > button {
        background: linear-gradient(135deg, #67e5ee 0%, #22d3ee 100%) !important;
        color: #000000 !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        border-radius: 20px !important;
        border: none !important;
        padding: 10px 24px !important;
        box-shadow: 0 4px 15px rgba(103, 229, 238, 0.25) !important;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# SESSION STATE NAVIGATION (Layer by Layer Architecture)
# ---------------------------------------------------------
if "view_mode" not in st.session_state:
    st.session_state.view_mode = "main"

if "selected_leader" not in st.session_state:
    st.session_state.selected_leader = None

def navigate_to(page, leader=None):
    st.session_state.view_mode = page
    if leader:
        st.session_state.selected_leader = leader
    st.rerun()

# ---------------------------------------------------------
# SIDEBAR CONTROLS
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("### ⚙️ Simulation Engine")
    st.caption("MochaTrade Macroeconomic Growth Model")
    
    with st.expander("💳 1. Pricing & Take-Rate", expanded=True):
        fee_rate = st.slider("Blended Trading Fee (%)", min_value=0.02, max_value=0.50, value=0.05, step=0.01) / 100
        pro_tier_sub = st.number_input("MochaPro Monthly Tier ($)", min_value=0, max_value=200, value=29)
        high_tier_users_pct = st.slider("Pro Tier Adoption (%)", 2, 25, 8) / 100

    with st.expander("🌱 2. Non-Paid Growth Channel", expanded=True):
        organic_baseline = st.number_input("Monthly Organic Visitors", value=3500, step=250)
        k_factor = st.slider("Viral Loop (K-Factor)", min_value=0.0, max_value=0.60, value=0.28, step=0.02,
                             help="Number of active referrals generated per student trader across campus syndicates")
        content_mom_growth = st.slider("Community Content MoM (%)", 0, 20, 8) / 100

    with st.expander("🔒 3. Trust Architecture Toggles", expanded=True):
        st.caption("Institutional grade friction mitigators")
        t_escrow = st.toggle("On-Chain Non-Custodial Escrow", value=True)
        t_circuit = st.toggle("-10% Algorithmic Circuit Breaker", value=True)
        t_audit = st.toggle("Tier-1 Smart Contract Audit", value=True)
        t_upi = st.toggle("1-Tap Instant UPI Settlement (<4.2s)", value=True)

    currency = st.radio("Display Currency", ["INR (₹)", "USD ($)"], horizontal=True)
    fx_rate = 83.0 if currency == "INR (₹)" else 1.0
    c_symbol = "₹" if currency == "INR (₹)" else "$"
    view_granularity = st.radio("Simulation View", ["12-Month Trajectory", "Monthly Data Audit"], horizontal=True)

# ---------------------------------------------------------
# COMPUTATION CORE (Growth, Trust Elasticity & Scenarios)
# ---------------------------------------------------------
trust_score = 50
if t_escrow: trust_score += 18
if t_circuit: trust_score += 15
if t_audit: trust_score += 12
if t_upi: trust_score += 8

trust_multiplier = trust_score / 50.0
base_conv = 0.024 * (trust_multiplier ** 0.85)
base_trade_size = (1850 * fx_rate) * (trust_multiplier ** 0.65)
churn_rate = max(0.02, 0.075 / (trust_multiplier ** 0.5))

months = np.arange(1, 13)
active_traders = []
gmv_volume = []
platform_revenue = []

traders = 250
for m in months:
    organic_traffic = organic_baseline * ((1 + content_mom_growth) ** (m - 1))
    new_traders = (organic_traffic * base_conv) + (traders * k_factor)
    traders = (traders * (1 - churn_rate)) + new_traders
    vol = traders * base_trade_size * 4.4
    rev = (vol * fee_rate) + (traders * high_tier_users_pct * (pro_tier_sub * fx_rate))
    
    active_traders.append(int(traders))
    gmv_volume.append(vol)
    platform_revenue.append(rev)

df_sim = pd.DataFrame({
    "Month": [f"M{i}" for i in months],
    "Month_Num": months,
    "Traders": active_traders,
    "Volume": gmv_volume,
    "Revenue": platform_revenue
})

# Baseline Legacy Scenario (Scenario A)
base_vol = [v * 0.42 for v in gmv_volume]
base_rev = [r * 0.51 for r in platform_revenue]

# =========================================================
# LAYER 1: MAIN DASHBOARD
# =========================================================
if st.session_state.view_mode == "main":
    st.markdown("""
    <div class="lab-header">
        <div class="lab-title">TRADEX LABS · MOCHATRADE</div>
        <div class="lab-subtitle">
            Dr. AIT Campus Syndicate & Macroeconomic Simulator · Stage V Model
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.markdown(f'<div class="crypto-card"><div class="metric-label">12M Net Revenue</div>'
                    f'<div class="metric-value">{c_symbol}{df_sim["Revenue"].sum():,.0f}</div>'
                    '<span style="color:#48d297; font-size:12px;">↑ High-margin take-rate</span></div>', unsafe_allow_html=True)
    with m2:
        st.markdown(f'<div class="crypto-card"><div class="metric-label">12M Trading Volume (GMV)</div>'
                    f'<div class="metric-value">{c_symbol}{df_sim["Volume"].sum():,.0f}</div>'
                    '<span style="color:#67e5ee; font-size:12px;">Compounding Liquidity</span></div>', unsafe_allow_html=True)
    with m3:
        st.markdown(f'<div class="crypto-card"><div class="metric-label">Trust Index Rating</div>'
                    f'<div class="metric-value">{trust_score}<span style="font-size:14px;color:#7c879d;">/100</span></div>'
                    f'<div class="trust-pill">{trust_multiplier:.2f}x Conversion Boost</div></div>', unsafe_allow_html=True)
    with m4:
        st.markdown(f'<div class="crypto-card"><div class="metric-label">Retained Traders (M12)</div>'
                    f'<div class="metric-value">{df_sim["Traders"].iloc[-1]:,}</div>'
                    '<span style="color:#ff914d; font-size:12px;">Active Market Makers</span></div>', unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # 12-Month Projection Chart
    st.markdown("### 📈 Live Dynamic Projections")
    if view_granularity == "12-Month Trajectory":
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df_sim["Month"], y=df_sim["Volume"],
            name=f"Projected Volume ({c_symbol})", mode="lines+markers",
            line=dict(color="#67e5ee", width=3),
            yaxis="y1"
        ))
        fig.add_trace(go.Bar(
            x=df_sim["Month"], y=df_sim["Revenue"],
            name=f"Monthly Revenue ({c_symbol})",
            marker=dict(color="rgba(72, 210, 151, 0.4)", line=dict(color="#48d297", width=1.5)),
            yaxis="y2"
        ))
        fig.update_layout(
            paper_bgcolor="#070a11",
            plot_bgcolor="#070a11",
            font=dict(color="#94a3b8", family="Plus Jakarta Sans"),
            yaxis=dict(title=f"Volume ({c_symbol})", gridcolor="#1e2433", side="left"),
            yaxis2=dict(title=f"Net Revenue ({c_symbol})", overlaying="y", side="right", showgrid=False),
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
            margin=dict(l=20, r=20, t=30, b=20),
            height=340
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.dataframe(
            df_sim[["Month", "Traders", "Volume", "Revenue"]].style.format({
                "Traders": "{:,.0f}",
                "Volume": f"{c_symbol}{{:,.2f}}",
                "Revenue": f"{c_symbol}{{:,.2f}}"
            }),
            use_container_width=True
        )

    # Trust Architecture
    st.markdown("### 🛡️ Institutional Trust & Conversion Funnel")
    t_col1, t_col2, t_col3 = st.columns(3)
    with t_col1:
        st.markdown("""
        <div class="crypto-card">
            <div style="font-weight:600; color:#67e5ee;">Stage 1: Inbound Discovery</div>
            <p style="font-size:12px; color:#94a3b8; margin-top:8px;">
                Prospective traders verify real-time audited win rates on Dr. AIT leader nodes prior to creating accounts.
            </p>
            <div style="font-size:11px; color:#48d297;">Deposit Hesitation: -48%</div>
        </div>
        """, unsafe_allow_html=True)
    with t_col2:
        st.markdown("""
        <div class="crypto-card">
            <div style="font-weight:600; color:#67e5ee;">Stage 2: Capital Deployment</div>
            <p style="font-size:12px; color:#94a3b8; margin-top:8px;">
                Funds route directly into segregated smart contract escrows with audited -10% circuit-breakers.
            </p>
            <div style="font-size:11px; color:#48d297;">Average Trade Size: +65%</div>
        </div>
        """, unsafe_allow_html=True)
    with t_col3:
        st.markdown("""
        <div class="crypto-card">
            <div style="font-weight:600; color:#67e5ee;">Stage 3: Syndicate Bond</div>
            <p style="font-size:12px; color:#94a3b8; margin-top:8px;">
                Traders lock capital behind verified Dr. AIT syndicate leaders under algorithmic 5% performance-fee rules.
            </p>
            <div style="font-size:11px; color:#48d297;">Monthly Churn: Reduced to 2.0%</div>
        </div>
        """, unsafe_allow_html=True)

    # Scenario Comparison
    st.markdown("### ⚖️ Strategic Scenario Analysis")
    c_base, c_rec = st.columns(2)
    with c_base:
        st.markdown(f"""
        <div class="crypto-card" style="border-left: 3px solid #ef4444;">
            <div style="font-weight:600; color:#ef4444;">Scenario A: Traditional / Baseline</div>
            <div style="font-size:12px; color:#94a3b8; margin: 8px 0;">Pure paid user acquisition, generic custody, no viral social layer.</div>
            <div class="metric-value" style="font-size:20px; color:#94a3b8;">{c_symbol}{sum(base_rev):,.0f}</div>
            <span style="font-size:11px; color:#ef4444;">High CAC, heavy plateau at Month 6</span>
        </div>
        """, unsafe_allow_html=True)
        
    with c_rec:
        delta_pct = ((df_sim["Revenue"].sum() - sum(base_rev)) / sum(base_rev)) * 100
        st.markdown(f"""
        <div class="crypto-card" style="border-left: 3px solid #48d297;">
            <div style="font-weight:600; color:#48d297;">Scenario B: MochaTrade Syndicate (Recommended)</div>
            <div style="font-size:12px; color:#94a3b8; margin: 8px 0;">Trust-optimized conversion, Dr. AIT hostel syndicates, viral K-Factor loops.</div>
            <div class="metric-value" style="font-size:20px; color:#48d297;">{c_symbol}{df_sim["Revenue"].sum():,.0f}</div>
            <span style="font-size:11px; color:#48d297;">+{delta_pct:.1f}% revenue delta</span>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")

    # Portal to Syndicates
    st.markdown("### ☕ Dr. AIT Campus Syndicate Engine")
    synd_col_left, synd_col_right = st.columns([3, 1])
    with synd_col_left:
        st.write(
            "Syndicates empower reputable lead traders at Dr. AIT to pool capital, automate alpha execution, and distribute "
            "institutional yield. Backed by on-chain escrow and verifiable performance metrics, syndicates "
            "turn passive platform users into sticky, recurring high-volume liquidity providers."
        )
    with synd_col_right:
        if st.button("Enter Dr. AIT Syndicate Hub ➔", use_container_width=True):
            navigate_to("syndicates_list")

# =========================================================
# LAYER 2: SYNDICATE DIRECTORY & LEADERS
# =========================================================
elif st.session_state.view_mode == "syndicates_list":
    b_col1, b_col2 = st.columns([1, 8])
    with b_col1:
        if st.button("← Back"):
            navigate_to("main")
    with b_col2:
        st.markdown("<h3 style='margin:0;'>MochaTrade Campus Syndicate Directory</h3>", unsafe_allow_html=True)
        st.caption("Select a verified lead trader to inspect algorithmic allocation and performance metrics.")

    st.markdown("<br>", unsafe_allow_html=True)
    search_query = st.text_input("🔍 Search leaders by handle, strategy, or campus cohort:", placeholder="e.g. iitb, Satoshi, Arbitrage")
    
    leaders = [
        {"name": "Namith DR", "handle": "@namith_quant", "location": "IIT Bombay (CS)", "followers": 4120, "aum": f"{c_symbol}{(4200000 if currency=='INR (₹)' else 50000):,.0f}", "roi": "+78.4%", "style": "Nvidia Earnings Momentum"},
        {"name": "Mallikarjun", "handle": "@mallikarjun_alpha", "location": "BITS Pilani Alumni", "followers": 8940, "aum": f"{c_symbol}{(9800000 if currency=='INR (₹)' else 118000):,.0f}", "roi": "+81.2%", "style": "Cross-DEX Arbitrage"},
        {"name": "Pruthvi Rao", "handle": "@macro_pruthvi", "location": "RVCE FinTech Society", "followers": 2830, "aum": f"{c_symbol}{(3500000 if currency=='INR (₹)' else 42000):,.0f}", "roi": "+74.5%", "style": "Tesla Robotaxi Macro"},
        {"name": "Campus Quant Node", "handle": "@campus_quant", "location": "IIT Madras Quant Club", "followers": 6190, "aum": f"{c_symbol}{(5600000 if currency=='INR (₹)' else 68000):,.0f}", "roi": "+76.8%", "style": "High-Frequency Liquidity"}
    ]
    
    filtered_leaders = [l for l in leaders if search_query.lower() in l['name'].lower() or search_query.lower() in l['location'].lower() or search_query.lower() in l['style'].lower() or search_query.lower() in l['handle'].lower()]

    for leader in filtered_leaders:
        st.markdown(f"""
        <div class="leader-box">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-weight:700; font-size:16px; color:#f8fafc;">{leader['name']}</span>
                    <span style="color:#67e5ee; font-size:13px; margin-left:8px;">{leader['handle']}</span>
                    <div style="font-size:12px; color:#94a3b8; margin-top:4px;">📍 {leader['location']} • Strategy: <span style="color:#e2e8f0;">{leader['style']}</span></div>
                </div>
                <div style="text-align:right;">
                    <div style="font-family:'JetBrains Mono'; font-size:18px; color:#48d297; font-weight:600;">{leader['roi']}</div>
                    <div style="font-size:11px; color:#7c879d;">Audited Win Rate</div>
                </div>
            </div>
            <div style="margin-top:12px; font-size:12px; color:#94a3b8; display:flex; gap:20px;">
                <span>👥 {leader['followers']:,} Campus Backers</span>
                <span>💼 Total AUM: {leader['aum']}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button(f"Inspect Syndicate Pool ➔ ({leader['handle']})", key=leader['handle']):
            navigate_to("syndicate_detail", leader=leader)

# =========================================================
# LAYER 3: INNER PAGE - SPECIFIC SYNDICATE SPEC
# =========================================================
elif st.session_state.view_mode == "syndicate_detail":
    ldr = st.session_state.selected_leader
    
    b_col1, b_col2 = st.columns([1, 8])
    with b_col1:
        if st.button("← Directory"):
            navigate_to("syndicates_list")
    with b_col2:
        st.markdown(f"<h3 style='margin:0;'>{ldr['name']} ({ldr['handle']})</h3>", unsafe_allow_html=True)
        st.caption(f"Verified Dr. AIT Lead Node • {ldr['location']} • Non-Custodial Escrow Backed")

    st.markdown("<br>", unsafe_allow_html=True)

    d1, d2, d3 = st.columns(3)
    with d1:
        st.markdown(f"""
        <div class="crypto-card">
            <div class="metric-label">Syndicate Vault Balance</div>
            <div class="metric-value">{ldr['aum']}</div>
            <span style="font-size:12px; color:#48d297;">Locked in Smart Escrow</span>
        </div>
        """, unsafe_allow_html=True)
    with d2:
        st.markdown(f"""
        <div class="crypto-card">
            <div class="metric-label">Audited Win Rate</div>
            <div class="metric-value" style="color:#48d297;">{ldr['roi']}</div>
            <span style="font-size:12px; color:#7c879d;">High-Water Mark Policy</span>
        </div>
        """, unsafe_allow_html=True)
    with d3:
        st.markdown(f"""
        <div class="crypto-card">
            <div class="metric-label">Total Campus Backers</div>
            <div class="metric-value">{ldr['followers']:,}</div>
            <span style="font-size:12px; color:#67e5ee;">-10% Circuit Breaker Active</span>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("#### Vault Allocations & Execution Specs")
    st.write(f"This syndicate trades primarily via **{ldr['style']}**. All capital stays programmatically locked inside MochaTrade's non-custodial smart contracts. Yield is automatically settled via instant UPI with a 5% performance fee allocated to the lead.")
    
    np.random.seed(42)
    timeline = pd.date_range(end=pd.Timestamp.now(), periods=12, freq='ME')
    yield_curve = np.cumprod(1 + np.random.uniform(0.01, 0.06, size=12)) * (10000 * fx_rate)

    fig_vault = go.Figure()
    fig_vault.add_trace(go.Scatter(
        x=timeline, y=yield_curve,
        mode="lines", fill="tozeroy",
        line=dict(color="#67e5ee", width=2),
        fillcolor="rgba(103, 229, 238, 0.15)"
    ))
    fig_vault.update_layout(
        paper_bgcolor="#070a11",
        plot_bgcolor="#070a11",
        font=dict(color="#94a3b8"),
        title=f"Historical Vault Growth ({c_symbol}{10000*fx_rate:,.0f} Initial Principal)",
        height=300,
        margin=dict(l=20, r=20, t=35, b=20)
    )
    st.plotly_chart(fig_vault, use_container_width=True)

    if st.button("Simulate Capital Allocation to this Syndicate", use_container_width=True):
        st.success(f"Position modeled! This action routes {c_symbol}{5000*fx_rate:,.0f} into {ldr['handle']}'s smart escrow pool.")
