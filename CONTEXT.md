# Hijama Exorcist

Domain glossary for architecture and design work.

## Clinic Contact

The resolved clinic contact facts used across the marketing site: phone, WhatsApp number and prefilled message, email, city/service area, social `sameAs` URLs, and MedicalBusiness JSON-LD inputs.

**Module:** `src/lib/clinicContact.ts` (`getClinicContact`)
**Consumers:** WhatsApp float, Clinic JSON-LD, (future) forms

## Module

A Sanity-backed page section (schema + React frontend), registered in `MODULE_MAP`.

## Booking Intake

Appointment / contact request submission path (FormEasy today). Shared validation and rate-limiting belong behind this seam when a first-party route exists.
