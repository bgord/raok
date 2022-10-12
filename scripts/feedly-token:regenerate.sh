#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh

info "Do-nothing script guide to regenerate FEEDLY_TOKEN"

info "Go to https://feedly.com/v3/auth/dev and acquire the new FEEDLY_TOKEN."
press_enter_to_continue

info "Replace the FEEDLY_TOKEN in .env.staging in your password manager."
press_enter_to_continue

info "Copy-paste .env.staging from Keeper to your local machine"
press_enter_to_continue

info "Copy-paste the FEEDLY_TOKEN variable from .env.staging to .env.local"
press_enter_to_continue

info "Update ENV_STAGING variable in https://github.com/bgord/raok/settings/secrets/actions"
press_enter_to_continue

success "FEEDLY_TOKEN regenerated"
