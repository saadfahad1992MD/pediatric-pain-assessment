CREATE TABLE `interventions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` int NOT NULL,
	`interventionType` enum('sucrose','skin_to_skin','breastfeeding','non_nutritive_sucking','swaddling','positioning','distraction_visual','distraction_auditory','comfort_holding','reduced_stimulation','topical_anesthetic','other') NOT NULL,
	`effectivenessRating` enum('not_effective','partially_effective','effective','very_effective'),
	`notes` text,
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interventions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `painAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`assessorId` int NOT NULL,
	`scaleType` enum('pipp_r','flacc','wong_baker','cheops','nips','vas') NOT NULL,
	`scoreData` json NOT NULL,
	`totalScore` decimal(5,2) NOT NULL,
	`maxPossibleScore` int NOT NULL,
	`painLevel` enum('none','mild','moderate','severe') NOT NULL,
	`assessmentContext` enum('routine','pre_procedure','during_procedure','post_procedure','post_operative','medication_evaluation','comfort_check','other') DEFAULT 'routine',
	`clinicalNotes` text,
	`interventionsApplied` json,
	`patientAgeAtAssessment` varchar(50),
	`assessedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `painAssessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientIdentifier` varchar(100) NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`dateOfBirth` timestamp,
	`gestationalAgeWeeks` int,
	`unitType` enum('nicu','picu','pediatric_ward','emergency','outpatient','surgery','other'),
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `interventions` ADD CONSTRAINT `interventions_assessmentId_painAssessments_id_fk` FOREIGN KEY (`assessmentId`) REFERENCES `painAssessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `painAssessments` ADD CONSTRAINT `painAssessments_patientId_patients_id_fk` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `painAssessments` ADD CONSTRAINT `painAssessments_assessorId_users_id_fk` FOREIGN KEY (`assessorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patients` ADD CONSTRAINT `patients_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;