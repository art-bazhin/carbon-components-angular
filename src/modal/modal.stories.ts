import { storiesOf, moduleMetadata } from "@storybook/angular";
import { withKnobs, text, select } from "@storybook/addon-knobs/angular";

import { ModalModule } from "../";
import { Component, Input, Inject } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalService, DocumentationModule } from "../";
import { ModalButton, AlertModalType, ModalButtonType } from "./alert-modal.interface";
import { PlaceholderModule } from "./../placeholder/placeholder.module";
import { BaseModal } from "./base-modal.class";

@Component({
	selector: "app-sample-modal",
	template: `
		<ibm-modal [size]="size" (overlaySelected)="closeModal()">
			<ibm-modal-header (closeSelect)="closeModal()">Header label</ibm-modal-header>
			<section class="bx--modal-content">
				<h1>Sample modal works.</h1>
				<p class="bx--modal-content__text">{{modalText}}</p>
			</section>
			<ibm-modal-footer>
				<button class="bx--btn bx--btn--secondary" (click)="showSecondaryModal()">Show Secondary Modal</button>
				<button class="bx--btn bx--btn--primary" modal-primary-focus (click)="closeModal()">Close</button>
			</ibm-modal-footer>
		</ibm-modal>
	`
})
class SampleModal extends BaseModal {
	constructor(
		@Inject("modalText") public modalText,
		@Inject("size") public size,
		protected modalService: ModalService) {
		super();
	}

	showSecondaryModal() {
		this.modalService.show({
			modalLabel: "Secondary header label",
			modalTitle: "Sample secondary modal works.",
			modalContent: this.modalText,
			size: this.size,
			buttons: [{
				text: "Cancel",
				type: ModalButtonType.secondary
			}, {
				text: "OK",
				type: ModalButtonType.primary,
				click: () => alert("OK button clicked")
			}]
		});
	}
}

@Component({
	selector: "app-modal-story",
	template: `
		<button class="bx--btn bx--btn--primary" (click)="openModal()">Open Modal</button>
	`
})
class ModalStory {

	@Input() modalText = "Hello, World";

	@Input() size = "default";

	constructor(protected modalService: ModalService) { }

	openModal() {
		this.modalService.create({
			component: SampleModal,
			inputs: {
				modalText: this.modalText,
				size: this.size
			}
		});
	}
}


@Component({
	selector: "app-alert-modal-story",
	template: `
		<button class="bx--btn bx--btn--primary" (click)="openModal()">Open Modal</button>
	`
})
class AlertModalStory {
	@Input() modalType: AlertModalType;
	@Input() modalLabel: string;
	@Input() modalTitle: string;
	@Input() modalContent: string;
	@Input() buttons: Array<ModalButton>;
	@Input() size: "xs" | "sm" | "default" | "lg";

	constructor(protected modalService: ModalService) { }

	openModal() {
		this.modalService.show({
			modalType: this.modalType,
			label: this.modalLabel,
			title: this.modalTitle,
			content: this.modalContent,
			size: this.size,
			buttons: this.buttons
		});
	}
}

storiesOf("Components|Modal", module)
	.addDecorator(
		moduleMetadata({
			declarations: [
				ModalStory,
				SampleModal,
				AlertModalStory
			],
			imports: [
				ModalModule,
				PlaceholderModule,
				BrowserAnimationsModule,
				DocumentationModule
			],
			entryComponents: [
				SampleModal
			]
		})
	)
	.addDecorator(withKnobs)
	.add("Basic", () => ({
		template: `
		<app-modal-story [modalText]="modalText" [size]="size"></app-modal-story>
		<ibm-placeholder></ibm-placeholder>
		`,
		props: {
			modalText: text("modalText", "Hello, World!"),
			size: select("size", ["xs", "sm", "default", "lg"], "default")
		}
	}))
	.add("Transactional", () => ({
		template: `
		<app-alert-modal-story
			[modalType]="modalType"
			[modalLabel]="modalLabel"
			[modalTitle]="modalTitle"
			[modalContent]="modalContent"
			[size]="size"
			[buttons]="buttons">
		</app-alert-modal-story>
		<ibm-placeholder></ibm-placeholder>
		`,
		props: {
			modalType: select("modalType", ["default", "danger"], "default"),
			modalLabel: text("modalLabel", "optional label"),
			modalTitle: text("modalTitle", "Delete service from application"),
			modalContent: text("modalContent", `Are you sure you want to remove the Speech to Text service from the node-test app?`),
			size: select("size", ["xs", "sm", "default", "lg"], "default"),
			buttons: [{
				text: "Cancel",
				type: "secondary"
			}, {
				text: "Delete",
				type: "primary",
				click: () => alert("Delete button clicked")
			}]
		}
	}))
	.add("Passive", () => ({
		template: `
		<app-alert-modal-story
			[modalType]="modalType"
			[modalLabel]="modalLabel"
			[modalTitle]="modalTitle"
			[size]="size"
			[modalContent]="modalContent">
		</app-alert-modal-story>
		<ibm-placeholder></ibm-placeholder>
		`,
		props: {
			modalType: select("modalType", ["default", "danger"], "default"),
			modalLabel: text("modalLabel", "optional label"),
			modalTitle: text("modalTitle", "Passive modal title"),
			size: select("size", ["xs", "sm", "default", "lg"], "default"),
			modalContent: text("modalContent", "Passive modal notifications should only appear if there is an action " +
				"the user needs to address immediately. Passive modal notifications are persistent on screen")
		}
	}))
	.add("Documentation", () => ({
		template: `
			<ibm-documentation src="documentation/components/Modal.html"></ibm-documentation>
		`
	}));
