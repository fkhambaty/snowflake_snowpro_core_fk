-- Alpine Retail / SnowPro Core — Lab 07 · Auth & network policies
-- Mostly conceptual for trial accounts. Do NOT apply a restrictive network
-- policy that locks you out — examples below are commented or allow-all.

USE ROLE ACCOUNTADMIN;

-- ---------------------------------------------------------------------------
-- 1) Inspect existing network policies (safe)
-- ---------------------------------------------------------------------------
SHOW NETWORK POLICIES;
-- DESCRIBE NETWORK POLICY <policy_name>;

-- ---------------------------------------------------------------------------
-- 2) SAFE demo policy — allows all IPv4 (teaching syntax only)
-- Creating is OK; ATTACHING to account/user can still surprise you — leave
-- ALTER commented unless you know your egress IPs.
-- ---------------------------------------------------------------------------
CREATE NETWORK POLICY IF NOT EXISTS NP_ALPINE_LAB_ALLOW_ALL
  ALLOWED_IP_LIST = ('0.0.0.0/0')
  COMMENT = 'Lab 07 teaching object — allows all IPv4; do not treat as prod hardening';

DESCRIBE NETWORK POLICY NP_ALPINE_LAB_ALLOW_ALL;
SHOW NETWORK POLICIES LIKE 'NP_ALPINE%';

-- DO NOT run on a shared/prod account without knowing your IPs:
/*
CREATE NETWORK POLICY NP_ALPINE_OFFICE_ONLY
  ALLOWED_IP_LIST = ('203.0.113.10/32')   -- replace with YOUR office IP
  BLOCKED_IP_LIST = ()
  COMMENT = 'Example — office allow-list';

-- Attach to account (dangerous if IP wrong):
-- ALTER ACCOUNT SET NETWORK_POLICY = NP_ALPINE_OFFICE_ONLY;

-- Attach to a single user (safer blast radius):
-- ALTER USER some_service_user SET NETWORK_POLICY = NP_ALPINE_OFFICE_ONLY;

-- Remove:
-- ALTER ACCOUNT UNSET NETWORK_POLICY;
-- ALTER USER some_service_user UNSET NETWORK_POLICY;
-- DROP NETWORK POLICY NP_ALPINE_OFFICE_ONLY;
*/

-- ---------------------------------------------------------------------------
-- 3) MFA / SSO / key-pair / OAuth — configuration notes (not runnable DDL)
-- ---------------------------------------------------------------------------
/*
-- MFA (Snowsight / user profile — UI):
--   User enables Duo / TOTP authenticator. Exam: MFA = something you have
--   (phone/app) + password. Reduces credential-stuffing risk.

-- Federated SSO (ACCOUNTADMIN + IdP admin — Security Integrations):
--   CREATE SECURITY INTEGRATION alpine_sso
--     TYPE = SAML2
--     ENABLED = TRUE
--     SAML2_ISSUER = '...'
--     SAML2_SSO_URL = '...'
--     SAML2_PROVIDER = 'OKTA'  -- example
--     SAML2_X509_CERT = '...'
--     ;
--   Users authenticate at Okta/Azure AD → Snowflake session. MFA often at IdP.

-- Key-pair auth (service accounts / SnowSQL / connectors):
--   1. openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out rsa_key.p8 -nocrypt
--   2. openssl rsa -in rsa_key.p8 -pubout -out rsa_key.pub
--   3. ALTER USER svc_loader SET RSA_PUBLIC_KEY='MIIB...';
--   4. Connect with private key — no password in CI secrets if vaulted well.
--   Exam: prefer key-pair (or OAuth) for automation; humans use SSO+MFA.

-- OAuth (partner apps / custom clients):
--   CREATE SECURITY INTEGRATION ... TYPE = OAUTH ...
--   Client gets token; Snowflake validates. Used by BI tools, custom apps.
*/

-- ---------------------------------------------------------------------------
-- 4) Trust Center awareness (UI feature — Enterprise+ / account setting)
-- ---------------------------------------------------------------------------
/*
-- Trust Center (Snowsight): Security → Trust Center
--   Scans account against CIS-style / Snowflake security recommendations
--   (e.g. users without MFA, overly open network policies, auth risks).
--   Exam awareness: it surfaces posture findings — it does not replace RBAC
--   design or network policies by itself.
*/

-- ---------------------------------------------------------------------------
-- 5) Session context (safe always)
-- ---------------------------------------------------------------------------
SELECT CURRENT_USER(), CURRENT_ROLE(), CURRENT_ACCOUNT(), CURRENT_REGION();

USE ROLE ROLE_CORE_LAB_ADMIN;
USE WAREHOUSE WH_CORE_XS;
SELECT 'Lab 07 auth/network review complete' AS STATUS;
